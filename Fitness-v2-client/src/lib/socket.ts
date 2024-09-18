export type Message = {
  action: MessageActions;
  data?: string;
};
type MessageActions = "greet" | "broadcastAll" | "broadcast";

export function SendSocketMessage(message: Message, socket: WebSocket | null) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const messageString = JSON.stringify(message);
    console.log("Sending message:", messageString);
    socket.send(messageString);
  } else {
    console.log("WebSocket is not open. Cannot send message.");
  }
}
