import { create } from "zustand";

type SocketState = {
  socket: WebSocket | null;
};

type SocketActions = {
  connSocket: () => void;
  disconnectSocket: () => void;
};

type SocketStore = SocketState & SocketActions;

type Message = {
  action: string;
  data: string;
};

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

        if (message.action === "greet") {
          console.log("Received greet from websocket:", message.data);
        } else {
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
