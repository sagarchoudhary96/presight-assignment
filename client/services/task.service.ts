import { io, Socket } from "socket.io-client";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export class TaskService {
  private socket: Socket;
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${BASE_API_URL}/api/tasks`;
    this.socket = io(BASE_API_URL || "http://localhost:3001", {
      transports: ["websocket"],
      reconnection: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to task socket server");
    });
  }

  async createTask(payload?: any) {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    return response.json();
  }

  onTaskCompleted(
    callback: (data: { taskId: string; result: string }) => void
  ) {
    this.socket.on("task:completed", callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
