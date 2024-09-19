import { create } from "zustand";
import { type Message } from "~/lib/socket";

type SocketState = {
  socket: WebSocket | null;
};

type SocketActions = {
  connSocket: () => void;
  disconnectSocket: () => void;
  sendSocketMessage: (msg: string) => void;
  joinSocketGroup: (group: string) => void;
  leaveSocketGroup: (group: string) => void;
  sendSocketGroupMessage: (group: string, msg: string) => void;
  sendSocketAllGroupsMessage: (msg: string) => void;
  sendSocketGlobalMessage: (msg: string) => void;
  signInSocket: (email: string) => void;
  signOutSocket: () => void;
};

type SocketStore = SocketState & SocketActions;

const useSocket = create<SocketStore>((set, get) => ({
  socket: null,
  connSocket: () => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.onopen = () => {
      console.log("Connected to websocket");
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const message: Message = JSON.parse(event.data) as Message;

        switch (message.action) {
          case "greet":
            console.log("Received greet from websocket:", message.data);
            break;
          default:
            console.log("Received other message from websocket:", message);
        }
      } catch (error) {
        console.log("Failed to parse WebSocket message", error);
      }
    };

    ws.onclose = (event) => {
      console.log("Connection to websocket closed:", event.code, event.reason);
    };

    ws.onerror = (error) => {
      console.log("Error with websocket connection:", error);
    };

    set(() => ({ socket: ws }));
  },
  disconnectSocket: () => {
    get().socket?.close();
    set({ socket: null });
  },
  sendSocketMessage: (msg: string) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = { action: "greet", data: msg };
      const messageString = JSON.stringify(message);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  },
  joinSocketGroup: (group: string) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = {
        action: "join-group",
        data: group,
      };
      const messageString = JSON.stringify(message);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  },
  leaveSocketGroup: (group: string) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = { action: "leave-group", data: group };
      const messageString = JSON.stringify(message);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  },
  sendSocketGroupMessage: (group: string, data: string) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = {
        action: "broadcast-group",
        data: data,
        group: group,
      };
      const messageString = JSON.stringify(message);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  },
  sendSocketAllGroupsMessage: (msg: string) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = {
        action: "broadcast-all",
        data: msg,
      };
      const messageString = JSON.stringify(message);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  },
  sendSocketGlobalMessage: (msg: string) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = {
        action: "broadcast-global",
        data: msg,
      };
      const messageString = JSON.stringify(message);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  },
  signInSocket: (email: string) => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = { action: "sign-in", data: email };
      const messageString = JSON.stringify(message);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  },
  signOutSocket: () => {
    const ws = get().socket;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = { action: "sign-out" };
      const messageString = JSON.stringify(message);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  },
}));

export default useSocket;
