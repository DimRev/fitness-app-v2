export type Message = {
  action: MessageActions;
  data?: string;
  group?: string;
};
type MessageActions =
  | "greet"
  | "broadcast-all"
  | "broadcast-group"
  | "broadcast-global"
  | "sign-in"
  | "sign-out"
  | "join-group"
  | "leave-group";

export function SendSocketMessage(message: Message, socket: WebSocket | null) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const messageString = JSON.stringify(message);
    console.log("Sending message:", messageString);
    socket.send(messageString);
  } else {
    console.log("WebSocket is not open. Cannot send message.");
  }
}
