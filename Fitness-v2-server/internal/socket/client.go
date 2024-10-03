package socket

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"slices"

	"github.com/DimRev/Fitness-v2-server/internal/config"
	"github.com/DimRev/Fitness-v2-server/internal/models"
	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
)

type Client struct {
	ID     string
	Socket *websocket.Conn
	Hub    *SocketHub
	Send   chan Message
	User   models.User
	Groups []string
}

func SocketRoute(e *echo.Echo) {
	e.GET("/ws", ConnectSocket)
}

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func ConnectSocket(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		utils.FmtLogError("socket_controllers.go", "ConnectSocket", fmt.Errorf("failed to upgrade websocket: %s", err))
		return err
	}

	client := &Client{
		ID:     uuid.NewString(),
		Socket: ws,
		Hub:    &Hub,
		Send:   make(chan Message),
		User:   models.User{},
		Groups: []string{},
	}
	defer func() {
		Hub.Unregister <- client
		err = ws.WriteMessage(websocket.CloseMessage, []byte{})
		if err != nil {
			utils.FmtLogError("socket_controllers.go", "ConnectSocket", fmt.Errorf("failed to write close message: %s", err))
		}
	}()

	go client.SendMessage()
	Hub.Register <- client

	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			utils.FmtLogError("socket_controllers.go", "ConnectSocket", fmt.Errorf("failed to read message: %s", err))
			break
		}
		var msgData Message
		err = json.Unmarshal(msg, &msgData)
		if err != nil {
			utils.FmtLogError("socket_controllers.go", "ConnectSocket", fmt.Errorf("failed to unmarshal message: %s", err))
			break
		}
		client.HandleMessage(msgData)
	}

	return nil
}

func (c *Client) SendMessage() {
	for msg := range c.Send {
		msgBytes, err := json.Marshal(msg)
		if err != nil {
			utils.FmtLogError("socket_controllers.go", "SendMessage", fmt.Errorf("failed to marshal message: %s", err))
			c.Hub.Unregister <- c
			return
		}
		err = c.Socket.WriteMessage(websocket.TextMessage, msgBytes)
		if err != nil {
			utils.FmtLogError("socket_controllers.go", "SendMessage", fmt.Errorf("failed to write message: %s", err))
			c.Hub.Unregister <- c
			return
		}
	}
}

func (c *Client) HandleMessage(msg Message) {
	switch msg.Action {
	case Greet:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("Greet [%s]: %s", c.ID, msg.Data))
		msgToBroadcast := msg.TransformIntoMessageToBroadcast(c, false)
		c.Hub.Broadcast <- msgToBroadcast

	case BroadcastAll:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("BroadcastAll [%s]: %s", c.ID, msg.Data))
		msgToBroadcast := msg.TransformIntoMessageToBroadcast(c, false)
		c.Hub.Broadcast <- msgToBroadcast

	case BroadcastGroup:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("Broadcast [%s]: %s", c.ID, msg.Data))
		msgToBroadcast := msg.TransformIntoMessageToBroadcast(c, false)
		c.Hub.Broadcast <- msgToBroadcast

	case BroadcastGlobal:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("GlobalBroadcast [%s]: %s", c.ID, msg.Data))
		msgToBroadcast := msg.TransformIntoMessageToBroadcast(c, true)
		c.Hub.Broadcast <- msgToBroadcast

	case JoinGroup:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("JoinGroup [%s]: %s", c.ID, msg.Data))
		if !slices.Contains(c.Groups, msg.Data) {
			c.Groups = append(c.Groups, msg.Data)
		}

	case LeaveGroup:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("LeaveGroup [%s]: %s", c.ID, msg.Data))
		if slices.Contains(c.Groups, msg.Data) {
			for i, group := range c.Groups {
				if group == msg.Data {
					c.Groups = append(c.Groups[:i], c.Groups[i+1:]...)
					break
				}
			}
		}

	case SignIn:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("SignIn [%s]: %s", c.ID, msg.Data))
		dbUser, err := config.Queries.GetUserByEmail(context.Background(), msg.Data)
		if err != nil {
			utils.FmtLogError("socket_controllers.go", "HandleMessage", fmt.Errorf("failed to get user: %s", err))
			return
		}

		var imageUrl *string
		if dbUser.ImageUrl.Valid {
			imageUrl = &dbUser.ImageUrl.String
		}

		user := models.User{
			ID:           dbUser.ID,
			Email:        dbUser.Email,
			Username:     dbUser.Username,
			PasswordHash: dbUser.PasswordHash,
			ImageUrl:     imageUrl,
			CreatedAt:    dbUser.CreatedAt.Time,
			UpdatedAt:    dbUser.UpdatedAt.Time,
			Role:         dbUser.Role,
			SessionToken: uuid.NewString(),
		}
		c.User = user

	case SignOut:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("SignOut [%s]: %s", c.ID, msg.Data))
		c.User = models.User{}
		c.Groups = []string{}
	}
}
