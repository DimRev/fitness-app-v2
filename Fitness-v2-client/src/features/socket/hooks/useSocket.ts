import { type QueryClient } from "react-query";
import { toast } from "sonner";
import { create, type StoreApi } from "zustand";
import { QUERY_KEYS } from "~/lib/reactQuery";
import { parseJSONData } from "~/lib/socket";

type SocketState = {
  socket: WebSocket | null;
  isConnecting: boolean;
};

type SocketActions = {
  connSocket: (queryClient: QueryClient) => Promise<WebSocket | null>;
  disconnectSocket: () => Promise<void>;
  sendSocketMessage: (msg: string) => Promise<void>;
  joinSocketGroup: (group: string) => Promise<void>;
  leaveSocketGroup: (group: string) => Promise<void>;
  sendSocketGroupMessage: (group: string, msg: BroadcastData) => Promise<void>;
  sendSocketAllGroupsMessage: (msg: BroadcastData) => Promise<void>;
  sendSocketGlobalMessage: (msg: BroadcastData) => Promise<void>;
  signInSocket: (email: string) => Promise<void>;
  signOutSocket: () => Promise<void>;
};

type SocketStore = SocketState & SocketActions;

const useSocket = create<SocketStore>((set, get, store) => ({
  socket: null,
  isConnecting: false,
  connSocket: async (queryClient: QueryClient) => {
    if (get().isConnecting) {
      return null;
    }
    set({ isConnecting: true });
    const ws = await blockUntilConnect();
    set({ isConnecting: false });

    ws.onopen = () => {
      console.log("Connected to websocket");
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      handleEventMessage(event, queryClient);
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
    const message: SocketMessage = { action: "greet", data: msg };
    await sendMessage(store, message);
  },
  joinSocketGroup: async (group: string) => {
    const message: SocketMessage = {
      action: "join-group",
      data: group,
    };
    await sendMessage(store, message);
  },
  leaveSocketGroup: async (group: string) => {
    const message: SocketMessage = { action: "leave-group", data: group };
    await sendMessage(store, message);
  },
  sendSocketGroupMessage: async (group: string, data: BroadcastData) => {
    const stringifiedData = JSON.stringify(data);

    const message: SocketMessage = {
      action: "broadcast-group",
      data: stringifiedData,
      group: group,
    };
    await sendMessage(store, message);
  },
  sendSocketAllGroupsMessage: async (msg: BroadcastData) => {
    const stringifiedMsg = JSON.stringify(msg);
    const message: SocketMessage = {
      action: "broadcast-all",
      data: stringifiedMsg,
    };
    await sendMessage(store, message);
  },
  sendSocketGlobalMessage: async (msg: BroadcastData) => {
    const stringifiedMsg = JSON.stringify(msg);

    const message: SocketMessage = {
      action: "broadcast-global",
      data: stringifiedMsg,
    };
    await sendMessage(store, message);
  },
  signInSocket: async (email: string) => {
    const message: SocketMessage = { action: "sign-in", data: email };
    await sendMessage(store, message);
  },
  signOutSocket: async () => {
    const message: SocketMessage = { action: "sign-out" };
    await sendMessage(store, message);
  },
}));

const MAX_RETRY = 3;
const RETRY_DELAY = 300;

async function blockUntilConnect() {
  const ws = new WebSocket(import.meta.env.VITE_WS_URL);
  while (ws.readyState !== WebSocket.OPEN) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return ws;
}

async function sendMessage(
  store: StoreApi<SocketStore>,
  message: SocketMessage,
) {
  let retry = 0;
  while (store.getState().socket == null && retry < MAX_RETRY) {
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    retry++;
  }
  const ws = store.getState().socket;
  if (ws && ws.readyState === WebSocket.OPEN) {
    const messageString = JSON.stringify(message);
    if (import.meta.env.MODE === "development") {
      console.log("(ws)-> Sending message:", message);
    }
    ws.send(messageString);
  } else {
    console.error("WebSocket is not open. Cannot send message.");
  }
}

function handleEventMessage(
  event: MessageEvent<string>,
  queryClient: QueryClient,
) {
  const message: SocketMessage = JSON.parse(event.data) as SocketMessage;
  switch (message.action) {
    case "greet":
      if (import.meta.env.MODE === "development") {
        console.log("<-(ws) Greet:", message.data);
      }
      break;
    case "user-notification":
      if (message.data) {
        const broadcastData = parseJSONData<UserNotificationBroadcastData>(
          message.data,
        );
        handleUserNotification(broadcastData, queryClient);
      }
      break;
    case "broadcast-group":
    case "broadcast-global":
    case "broadcast-all":
      if (message.data) {
        const broadcastData = parseJSONData<BroadcastData>(message.data);
        handleBroadcasts(broadcastData, queryClient);
      }
  }
}

function handleBroadcasts(
  broadcastData: BroadcastData,
  queryClient: QueryClient,
) {
  if (import.meta.env.MODE === "development") {
    console.log("<-(ws) Broadcast:", broadcastData);
  }
  if (broadcastData.action === "invalidate") {
    for (const group of broadcastData.group) {
      const params: Record<string, string | number | null> = {};
      for (const [key, value] of Object.entries(broadcastData.data)) {
        params[key] = value;
      }
      void queryClient.invalidateQueries([group, params]);
    }
  }
}

function handleCommonNotification(
  broadcastData: UserNotificationBroadcastData,
  queryClient: QueryClient,
) {
  void queryClient.invalidateQueries([
    QUERY_KEYS.NOTIFICATION.GET_NEW_USER_NOTIFICATIONS,
  ]);
  toast.info(broadcastData.data.title, {
    description: broadcastData.data.description,
    dismissible: true,
  });
}

function handleUserNotification(
  broadcastData: UserNotificationBroadcastData,
  queryClient: QueryClient,
) {
  if (import.meta.env.MODE === "development") {
    console.log("<-(ws) User notification:", broadcastData);
  }
  switch (broadcastData.action) {
    case "food-item-pending-got-like":
    case "score-pending-added":
      handleCommonNotification(broadcastData, queryClient);
      break;
  }
}

export default useSocket;
