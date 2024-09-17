package socket

type Message struct {
	Event string      `json:"event"`
	Group string      `json:"group"`
	Data  interface{} `json:"data"`
}
