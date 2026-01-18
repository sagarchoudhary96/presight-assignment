import { parentPort, workerData } from "worker_threads";

// Simulate heavy processing
const processTask = async (data) => {
  const { taskId, payload } = data;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const result = `Result for task ${taskId}: Processed ${
    payload || "default"
  } data.`;

  if (parentPort) {
    parentPort.postMessage({ taskId, result });
  }
};

processTask(workerData);
