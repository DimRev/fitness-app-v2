package socket

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

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

type Message struct {
	Action string `json:"action"`
	Data   string `json:"data"`
}

type SocketHub struct {
	Clients    map[*Client]bool
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan Message
	Mux        sync.Mutex
}

type Client struct {
	ID     string
	Socket *websocket.Conn
	Hub    *SocketHub
}

var Hub = SocketHub{
	Clients:    make(map[*Client]bool),
	Register:   make(chan *Client),
	Unregister: make(chan *Client),
	Broadcast:  make(chan Message),
}

func ConnectSocket(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	client := &Client{
		ID:     uuid.NewString(),
		Socket: ws,
		Hub:    &Hub,
	}
	defer func() {
		Hub.Unregister <- client
		ws.WriteMessage(websocket.CloseMessage, []byte{})
		ws.Close()
	}()

	Hub.Register <- client

	for {
		greetMsg := Message{
			Action: "greet",
			Data:   fmt.Sprintf("Welcome to the channel, [%d] are connected", len(Hub.Clients)),
		}
		greetMsgBytes, err := json.Marshal(greetMsg)
		if err != nil {
			c.Logger().Error(err)
			break
		}

		err = ws.WriteMessage(websocket.TextMessage, greetMsgBytes)
		if err != nil {
			c.Logger().Error(err)
			break
		}

		// Read
		_, msg, err := ws.ReadMessage()
		if err != nil {
			c.Logger().Error(err)
			break // Add a break statement to stop the loop on error
		}
		fmt.Printf("%s\n", msg)
	}

	return nil
}

func (h *SocketHub) RunHub() {
	for {
		select {
		case client := <-h.Register:
			h.Mux.Lock()
			h.Clients[client] = true
			fmt.Printf("Clients connected: %d\n", len(h.Clients))
			h.Mux.Unlock()
		case client := <-h.Unregister:
			h.Mux.Lock()
			delete(h.Clients, client)
			fmt.Printf("Clients connected: %d\n", len(h.Clients))
			h.Mux.Unlock()
		case msg := <-h.Broadcast:
			h.Mux.Lock()
			for client := range h.Clients {
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
