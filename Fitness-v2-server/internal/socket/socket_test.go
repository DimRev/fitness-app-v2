package socket

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func TestSockets(t *testing.T) {
	hub := NewHub()
	go hub.Run()

	// Create a test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			t.Fatalf("Failed to upgrade websocket: %v", err)
		}
		clientID := r.URL.Query().Get("clientID")
		if clientID == "" {
			t.Fatalf("clientID is required")
		}
		client := &Client{
			ID:     clientID,
			Email:  fmt.Sprintf("user%s@example.com", clientID),
			Hub:    hub,
			Conn:   conn,
			Send:   make(chan []byte),
			Groups: make(map[string]bool),
		}
		go client.WritePump()
		client.ReadPump()
	}))
	defer server.Close()

	baseURL := "ws" + server.URL[4:] // Replace "http" with "ws"

	testSingleClientConnectDisconnect(t, baseURL, hub)
	testClientsJoinAndLeave(t, baseURL, hub)
}

func testSingleClientConnectDisconnect(t *testing.T, baseURL string, hub *Hub) {
	// Append clientID
	wsURL := baseURL + "?clientID=1"
	// Connect to the server
	ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to connect to websocket server: %v", err)
	}
	defer ws.Close()

	// Send user-connected event
	sendEvent(ws, "user-connected", "", nil, t)

	// Allow time for the hub to process the registration
	time.Sleep(10 * time.Millisecond)

	if len(hub.Clients) != 1 {
		t.Errorf("Expected 1 client registered, got %d", len(hub.Clients))
	}

	// Send user-disconnected event
	sendEvent(ws, "user-disconnected", "", nil, t)

	// Allow time for the hub to process the unregistration
	time.Sleep(10 * time.Millisecond)

	if len(hub.Clients) != 0 {
		t.Errorf("Expected 0 clients after disconnection, got %d", len(hub.Clients))
	}
}

func testClientsJoinAndLeave(t *testing.T, baseURL string, hub *Hub) {
	// Connect client 1
	ws1URL := baseURL + "?clientID=1"
	ws1, _, err := websocket.DefaultDialer.Dial(ws1URL, nil)
	if err != nil {
		t.Fatalf("Failed to connect to websocket server: %v", err)
	}
	defer ws1.Close()

	// Connect client 2
	ws2URL := baseURL + "?clientID=2"
	ws2, _, err := websocket.DefaultDialer.Dial(ws2URL, nil)
	if err != nil {
		t.Fatalf("Failed to connect to websocket server: %v", err)
	}
	defer ws2.Close()

	// Clients send user-connected event
	sendEvent(ws1, "user-connected", "", nil, t)
	sendEvent(ws2, "user-connected", "", nil, t)

	// Allow time for the hub to process
	time.Sleep(10 * time.Millisecond)

	if len(hub.Clients) != 2 {
		t.Errorf("Expected 2 clients registered, got %d", len(hub.Clients))
	}

	// Clients join a group
	groupName := "test-group"
	sendEvent(ws1, "join-group", groupName, nil, t)
	sendEvent(ws2, "join-group", groupName, nil, t)

	// Allow time for group joining
	time.Sleep(10 * time.Millisecond)

	// Client 1 sends a message to the group
	messageData := "Hello, group!"
	sendEvent(ws1, "message", groupName, messageData, t)

	// Client 2 should receive the message
	receivedMessage := receiveEvent(ws2, t)
	if receivedMessage == nil {
		t.Fatalf("Client 2 did not receive any message")
	}

	// Verify the received message
	if receivedMessage.Event != "message" || receivedMessage.Group != groupName {
		t.Errorf("Client 2 received incorrect message: %+v", receivedMessage)
	}

	receivedData, ok := receivedMessage.Data.(string)
	if !ok {
		t.Errorf("Client 2 received data of incorrect type: %+v", receivedMessage.Data)
	} else if receivedData != messageData {
		t.Errorf("Client 2 received incorrect data: %s", receivedData)
	}

	// Clients leave the group and disconnect
	sendEvent(ws1, "leave-group", groupName, nil, t)
	sendEvent(ws2, "leave-group", groupName, nil, t)

	sendEvent(ws1, "user-disconnected", "", nil, t)
	sendEvent(ws2, "user-disconnected", "", nil, t)

	// Allow time for the hub to process the unregistrations
	time.Sleep(10 * time.Millisecond)

	if len(hub.Clients) != 0 {
		t.Errorf("Expected 0 clients after disconnection, got %d", len(hub.Clients))
	}
}

func receiveEvent(ws *websocket.Conn, t *testing.T) *Message {
	ws.SetReadDeadline(time.Now().Add(1 * time.Second))
	_, msgBytes, err := ws.ReadMessage()
	if err != nil {
		t.Fatalf("Failed to read message: %v", err)
		return nil
	}
	var msg Message
	if err := json.Unmarshal(msgBytes, &msg); err != nil {
		t.Fatalf("Failed to unmarshal message: %v", err)
		return nil
	}
	return &msg
}

// Helper function to send events
func sendEvent(ws *websocket.Conn, event, group string, data interface{}, t *testing.T) {
	msg := Message{
		Event: event,
		Group: group,
		Data:  data,
	}
	msgBytes, err := json.Marshal(msg)
	if err != nil {
		t.Fatalf("Failed to marshal message: %v", err)
	}
	if err := ws.WriteMessage(websocket.TextMessage, msgBytes); err != nil {
		t.Fatalf("Failed to send message: %v", err)
	}
}
