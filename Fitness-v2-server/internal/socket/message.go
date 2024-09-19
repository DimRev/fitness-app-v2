package socket

type MessageActions string

const (
	Greet MessageActions = "greet"

	BroadcastAll    MessageActions = "broadcast-all"
	BroadcastGroup  MessageActions = "broadcast-group"
	BroadcastGlobal MessageActions = "broadcast-global"

	SignIn  MessageActions = "sign-in"
	SignOut MessageActions = "sign-out"

	JoinGroup  MessageActions = "join-group"
	LeaveGroup MessageActions = "leave-group"

	UserNotification MessageActions = "user-notification"
)

type Message struct {
	Action MessageActions `json:"action"`
	Data   string         `json:"data,omitempty"`
	Group  string         `json:"group,omitempty"`
}

type MessageToBroadcast struct {
	Action MessageActions `json:"action"`
	Data   string         `json:"data,omitempty"`
	Group  string         `json:"group,omitempty"`
	Client *Client        `json:"-"`
	ToSelf bool           `json:"to_self"`
}
type MessageInterface interface {
	TransformIntoMessage() Message
}

func (m Message) TransformIntoMessage() Message {
	return m
}

func (m MessageToBroadcast) TransformIntoMessage() Message {
	return Message{
		Action: m.Action,
		Data:   m.Data,
	}
}

func (m Message) TransformIntoMessageToBroadcast(c *Client, ts bool) MessageToBroadcast {
	return MessageToBroadcast{
		Action: m.Action,
		Data:   m.Data,
		Group:  m.Group,
		Client: c,
		ToSelf: ts,
	}
}
