package socket

import (
	"encoding/json"
	"fmt"
	"slices"
	"sync"

	"github.com/DimRev/Fitness-v2-server/internal/utils"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type SocketHub struct {
	Clients    map[*Client]bool
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan MessageToBroadcast
	Mux        sync.Mutex
}

var Hub = SocketHub{
	Clients:    make(map[*Client]bool),
	Register:   make(chan *Client),
	Unregister: make(chan *Client),
	Broadcast:  make(chan MessageToBroadcast),
}

func (h *SocketHub) RunHub() {
	for {
		select {
		case client := <-h.Register:
			h.Mux.Lock()
			h.Clients[client] = true
			utils.FmtLogInfo("socket_controllers.go", "RunHub", fmt.Sprintf("Clients connected: %d", len(h.Clients)))
			h.Mux.Unlock()
			h.BroadcastToAll(Greet, fmt.Sprintf("A new client connected, [%d] are connected", len(h.Clients)))

		case client := <-h.Unregister:
			h.Mux.Lock()
			delete(h.Clients, client)
			close(client.Send)
			client.Socket.Close()
			utils.FmtLogInfo("socket_controllers.go", "RunHub", fmt.Sprintf("Clients connected: %d", len(h.Clients)))
			h.Mux.Unlock()
			h.BroadcastToAll(Greet, fmt.Sprintf("A client disconnected, [%d] are connected", len(h.Clients)))

		case msgToBroadcast := <-h.Broadcast:
			h.Mux.Lock()
			for client := range h.Clients {
				if !msgToBroadcast.ToSelf && client.ID == msgToBroadcast.Client.ID {
					continue
				}
				if msgToBroadcast.Action == BroadcastAll {
					isInOneOfGroups := false
					for _, group := range msgToBroadcast.Client.Groups {
						if slices.Contains(client.Groups, group) {
							isInOneOfGroups = true
						}
					}
					if !isInOneOfGroups {
						continue
					}
				}
				if msgToBroadcast.Action == BroadcastGroup {
					if !slices.Contains(client.Groups, msgToBroadcast.Group) {
						continue
					}
				}
				msg := msgToBroadcast.TransformIntoMessage()
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

func (h *SocketHub) BroadcastToGroup(group string, action MessageActions, data string) {
	h.Mux.Lock()
	defer h.Mux.Unlock()

	msg := Message{
		Action: action,
		Data:   data,
		Group:  group,
	}

	for client := range h.Clients {
		if slices.Contains(client.Groups, group) {
			msgBytes, err := json.Marshal(msg)
			if err != nil {
				client.Socket.Close()
				delete(h.Clients, client)
				continue
			}
			err = client.Socket.WriteMessage(websocket.TextMessage, msgBytes)
			if err != nil {
				client.Socket.Close()
				delete(h.Clients, client)
			}
		}
	}
}

func (h *SocketHub) BroadcastToAll(action MessageActions, data string) {
	h.Mux.Lock()
	defer h.Mux.Unlock()

	msg := Message{
		Action: action,
		Data:   data,
	}

	for client := range h.Clients {
		msgBytes, err := json.Marshal(msg)
		if err != nil {
			client.Socket.Close()
			delete(h.Clients, client)
			continue
		}
		err = client.Socket.WriteMessage(websocket.TextMessage, msgBytes)
		if err != nil {
			client.Socket.Close()
			delete(h.Clients, client)
		}
	}
}

func (h *SocketHub) BroadcastGlobal(action MessageActions, data string) {
	h.Mux.Lock()
	defer h.Mux.Unlock()

	msg := Message{
		Action: action,
		Data:   data,
	}

	for client := range h.Clients {
		msgBytes, err := json.Marshal(msg)
		if err != nil {
			client.Socket.Close()
			delete(h.Clients, client)
			continue
		}
		err = client.Socket.WriteMessage(websocket.TextMessage, msgBytes)
		if err != nil {
			client.Socket.Close()
			delete(h.Clients, client)
		}
	}
}

func (h *SocketHub) BroadcastToUser(userID uuid.UUID, action MessageActions, data string) {
	h.Mux.Lock()
	defer h.Mux.Unlock()

	msg := Message{
		Action: action,
		Data:   data,
	}

	for client := range h.Clients {
		if client.User.ID != userID {
			continue
		}
		fmt.Println(client.User.ID, userID)
		msgBytes, err := json.Marshal(msg)
		if err != nil {
			client.Socket.Close()
			delete(h.Clients, client)
			continue
		}
		err = client.Socket.WriteMessage(websocket.TextMessage, msgBytes)
		if err != nil {
			client.Socket.Close()
			delete(h.Clients, client)
		}
	}
}
