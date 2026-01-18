import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import { io } from "@/index";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Task {
  id: string;
  status: "pending" | "completed";
  result?: string;
}

const tasks: Map<string, Task> = new Map();

export const enqueueTask = (taskId: string, payload?: any) => {
  tasks.set(taskId, { id: taskId, status: "pending" });

  // Spawn worker
  const workerPath = path.resolve(__dirname, "task.worker.js");

  const worker = new Worker(workerPath, {
    workerData: { taskId, payload },
  });

  worker.on("message", (message) => {
    const { taskId, result } = message;
    const task = tasks.get(taskId);
    if (task) {
      task.status = "completed";
      task.result = result;

      // Notify via WebSocket
      io.emit("task:completed", { taskId, result });
    }
  });

  worker.on("error", (error) => {
    console.error(`Worker error for task ${taskId}:`, error);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code} for task ${taskId}`);
    }
  });

  return { status: "pending", taskId };
};

export const getTaskStatus = (taskId: string) => {
  return tasks.get(taskId);
};
