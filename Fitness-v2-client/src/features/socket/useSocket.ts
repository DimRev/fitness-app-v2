import { create } from "zustand";
import { type Message } from "~/lib/socket";

type SocketState = {
  socket: WebSocket | null;
};

type SocketActions = {
  connSocket: () => void;
  disconnectSocket: () => void;
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
}));

export default useSocket;
