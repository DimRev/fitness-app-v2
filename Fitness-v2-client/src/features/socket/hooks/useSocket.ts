import { toast } from "sonner";
import { create } from "zustand";
import {
  parseSocketData,
  type UserNotificationData,
  type Message,
} from "~/lib/socket";

type SocketState = {
  socket: WebSocket | null;
};

type SocketActions = {
  connSocket: () => Promise<WebSocket | null>;
  disconnectSocket: () => Promise<void>;
  sendSocketMessage: (msg: string) => Promise<void>;
  joinSocketGroup: (group: string) => Promise<void>;
  leaveSocketGroup: (group: string) => Promise<void>;
  sendSocketGroupMessage: (group: string, msg: string) => Promise<void>;
  sendSocketAllGroupsMessage: (msg: string) => Promise<void>;
  sendSocketGlobalMessage: (msg: string) => Promise<void>;
  signInSocket: (email: string) => Promise<void>;
  signOutSocket: () => Promise<void>;
};

type SocketStore = SocketState & SocketActions;

const useSocket = create<SocketStore>((set, get) => ({
  socket: null,
  connSocket: async () => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    const retryCount = 3;
    let retry = 0;
    while (ws.readyState !== WebSocket.OPEN) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retry++;
      if (retry >= retryCount) {
        console.log("Failed to connect to websocket");
        return null;
      }
    }

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
          case "user-notification":
            if (!message.data) {
              break;
            }
            // eslint-disable-next-line no-case-declarations
            const broadcastData = parseSocketData<UserNotificationData>(
              message.data,
            );
            console.log(
              "Received user-notification from websocket:",
              broadcastData,
            );
            toast.info(broadcastData.action, {
              description: broadcastData.data.description,
              dismissible: true,
            });
            break;
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

    return ws;
  },
  disconnectSocket: async () => {
    get().socket?.close();

    while (get().socket?.readyState !== WebSocket.CLOSED) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    set({ socket: null });
  },
  sendSocketMessage: async (msg: string) => {
    const retryCount = 3;
    let retry = 0;
    while (get().socket == null && retry < retryCount) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retry++;
    }

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
  joinSocketGroup: async (group: string) => {
    const retryCount = 3;
    let retry = 0;
    while (get().socket == null && retry < retryCount) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retry++;
    }
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
  leaveSocketGroup: async (group: string) => {
    const retryCount = 3;
    let retry = 0;
    while (get().socket == null && retry < retryCount) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retry++;
    }
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
  sendSocketGroupMessage: async (group: string, data: string) => {
    const retryCount = 3;
    let retry = 0;
    while (get().socket == null && retry < retryCount) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retry++;
    }
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
  sendSocketAllGroupsMessage: async (msg: string) => {
    const retryCount = 3;
    let retry = 0;
    while (get().socket == null && retry < retryCount) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retry++;
    }
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
  sendSocketGlobalMessage: async (msg: string) => {
    const retryCount = 3;
    let retry = 0;
    while (get().socket == null && retry < retryCount) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retry++;
    }
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
  signInSocket: async (email: string) => {
    const retryCount = 3;
    let retry = 0;
    while (get().socket === null && retry < retryCount) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retry++;
    }

    const ws = get().socket;
    console.log(ws);
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log("signing socket", email);
      const message: Message = { action: "sign-in", data: email };
      const messageString = JSON.stringify(message);
      console.log("Sending message:", messageString);
      ws.send(messageString);
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  },
  signOutSocket: async () => {
    const retryCount = 3;
    let retry = 0;
    while (get().socket == null && retry < retryCount) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      retry++;
    }
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
