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
  | "leave-group"
  | "user-notification";

export type BroadcastData = {
  group: string;
  data: {
    limit: number;
    offset: number;
    text_filter?: string | null;
  };
};

export type UserNotificationData = {
  action: UserNotificationDataAction;
  data: {
    title: string;
    description: string;
  };
};

type UserNotificationDataAction = "food-item-pending-got-like";

export function SendSocketMessage(message: Message, socket: WebSocket | null) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const messageString = JSON.stringify(message);
    console.log("Sending message:", messageString);
    socket.send(messageString);
  } else {
    console.log("WebSocket is not open. Cannot send message.");
  }
}

export function parseSocketData<T>(loggedMessage: string) {
  if (
    typeof loggedMessage === "string" &&
    loggedMessage.startsWith('"') &&
    loggedMessage.endsWith('"')
  ) {
    loggedMessage = loggedMessage.slice(1, -1); // Remove the first and last quote
  }

  return JSON.parse(loggedMessage) as T;
}
