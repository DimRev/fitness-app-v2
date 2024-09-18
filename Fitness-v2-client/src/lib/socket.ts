class WebSocketSingleton {
  private static instance: WebSocket | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): WebSocket {
    if (!WebSocketSingleton.instance) {
      WebSocketSingleton.instance = new WebSocket(import.meta.env.VITE_WS_URL);

      WebSocketSingleton.instance.onopen = () => {
        console.log("Connected to websocket");
      };

      WebSocketSingleton.instance.onmessage = (event) => {
        console.log("Received message from websocket:", event.data);
      };

      WebSocketSingleton.instance.onclose = (event) => {
        console.log(
          "Connection to websocket closed:",
          event.code,
          event.reason,
        );
      };

      WebSocketSingleton.instance.onerror = (error) => {
        console.log("Error with websocket connection:", error);
      };
    }
    return WebSocketSingleton.instance;
  }
}

export const socket = WebSocketSingleton.getInstance();
