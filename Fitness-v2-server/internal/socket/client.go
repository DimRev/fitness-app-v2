package socket

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID     string
	Email  string
	Hub    *Hub
	Conn   *websocket.Conn
	Send   chan []byte
	Groups map[string]bool
}

// Implement the Stringer interface for better logging
func (c *Client) String() string {
	return fmt.Sprintf("Client{ID: %s, Email: %s}", c.ID, c.Email)
}

func (c *Client) ReadPump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()
	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			log.Printf("Read error: %v", err)
			break
		}
		var msg Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("Unmarshal error: %v", err)
			continue
		}
		switch msg.Event {
		case "user-connected":
			c.Hub.Register <- c
		case "user-disconnected":
			c.Hub.Unregister <- c
			// Close the connection after unregistering
			return
		case "join-group":
			groupName := msg.Group
			if groupName == "" {
				log.Printf("Group name is empty")
				continue
			}
			c.Groups[groupName] = true
			log.Printf("Client %s joined group %s", c.ID, groupName)
		case "leave-group":
			groupName := msg.Group
			if groupName == "" {
				log.Printf("Group name is empty")
				continue
			}
			delete(c.Groups, groupName)
			log.Printf("Client %s left group %s", c.ID, groupName)
		default:
			// Broadcast the message to the group
			c.Hub.Broadcast <- msg
		}
	}
}

func (c *Client) WritePump() {
	defer c.Conn.Close()
	for message := range c.Send {
		c.Conn.WriteMessage(websocket.TextMessage, message)
	}
}
