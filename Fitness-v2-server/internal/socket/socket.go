package socket

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
)

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

type MessageActions string

const (
	Greet        MessageActions = "greet"
	BroadcastAll MessageActions = "broadcastAll"
	Broadcast    MessageActions = "broadcast"
)

type Message struct {
	Action MessageActions `json:"action"`
	Data   string         `json:"data,omitempty"`
}

type MessageToBroadcast struct {
	Action   MessageActions `json:"action"`
	Data     string         `json:"data,omitempty"`
	ClientID string         `json:"client_id"`
	ToSelf   bool           `json:"to_self"`
}

type SocketHub struct {
	Clients    map[*Client]bool
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan MessageToBroadcast
	Mux        sync.Mutex
}

type Client struct {
	ID     string
	Socket *websocket.Conn
	Hub    *SocketHub
	Send   chan Message
}

var Hub = SocketHub{
	Clients:    make(map[*Client]bool),
	Register:   make(chan *Client),
	Unregister: make(chan *Client),
	Broadcast:  make(chan MessageToBroadcast),
}

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
	}
	defer func() {
		Hub.Unregister <- client
		ws.WriteMessage(websocket.CloseMessage, []byte{})
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
		msgToBroadcast := MessageToBroadcast{
			Action:   msg.Action,
			Data:     msg.Data,
			ClientID: c.ID,
			ToSelf:   true,
		}
		c.Hub.Broadcast <- msgToBroadcast
	case BroadcastAll:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("BroadcastAll [%s]: %s", c.ID, msg.Data))
		msgToBroadcast := MessageToBroadcast{
			Action:   msg.Action,
			Data:     msg.Data,
			ClientID: c.ID,
			ToSelf:   true,
		}
		c.Hub.Broadcast <- msgToBroadcast
	case Broadcast:
		utils.FmtLogInfo("socket_controllers.go", "HandleMessage", fmt.Sprintf("Broadcast [%s]: %s", c.ID, msg.Data))
		msgToBroadcast := MessageToBroadcast{
			Action:   msg.Action,
			Data:     msg.Data,
			ClientID: c.ID,
			ToSelf:   false,
		}
		c.Hub.Broadcast <- msgToBroadcast
	}
}

func (h *SocketHub) RunHub() {
	for {
		select {
		case client := <-h.Register:
			h.Mux.Lock()
			h.Clients[client] = true
			utils.FmtLogInfo("socket_controllers.go", "RunHub", fmt.Sprintf("Clients connected: %d", len(h.Clients)))
			client.Send <- Message{
				Action: "greet",
				Data:   fmt.Sprintf("Welcome to the channel, [%d] are connected", len(h.Clients)),
			}
			h.Mux.Unlock()
		case client := <-h.Unregister:
			h.Mux.Lock()
			delete(h.Clients, client)
			close(client.Send)
			client.Socket.Close()
			utils.FmtLogInfo("socket_controllers.go", "RunHub", fmt.Sprintf("Clients connected: %d", len(h.Clients)))
			h.Mux.Unlock()
		case msgToBroadcast := <-h.Broadcast:
			h.Mux.Lock()
			for client := range h.Clients {
				if !msgToBroadcast.ToSelf && client.ID == msgToBroadcast.ClientID {
					continue
				}
				msg := Message{
					Action: msgToBroadcast.Action,
					Data:   msgToBroadcast.Data,
				}
				msgBytes, err := json.Marshal(msg)
				if err != nil {
					client.Socket.Close()
					delete(h.Clients, client)
				}
				err = client.Socket.WriteMessage(websocket.TextMessage, msgBytes)
				if err != nil {
					client.Socket.Close()
					delete(h.Clients, client)
				}
			}
			h.Mux.Unlock()
		}
	}

}
