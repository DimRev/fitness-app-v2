package socket

import (
	"encoding/json"
	"log"
	"sync"
)

type Hub struct {
	Clients    map[string]*Client
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan Message
	Mux        sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[string]*Client),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan Message),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			if client.ID == "" || client.Email == "" || client.Conn == nil {
				// Invalid client, do not register
				continue
			}
			h.Mux.Lock()
			h.Clients[client.ID] = client
			h.Mux.Unlock()
			log.Printf("Client registered: %v", client)
		case client := <-h.Unregister:
			h.Mux.Lock()
			if _, ok := h.Clients[client.ID]; ok {
				delete(h.Clients, client.ID)
				close(client.Send)
				log.Printf("Client unregistered: %v", client)
			}
			h.Mux.Unlock()
		case message := <-h.Broadcast:
			h.Mux.Lock()
			h.broadcastToGroup(message)
			h.Mux.Unlock()
		}
	}
}

func (h *Hub) broadcastToGroup(message Message) {
	for _, client := range h.Clients {
		if message.Group == "" || client.Groups[message.Group] {
			msgBytes, err := json.Marshal(message)
			if err != nil {
				log.Printf("Marshal error: %v", err)
				continue
			}
			client.Send <- msgBytes
		}
	}
}
