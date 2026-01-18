import type { Request, Response } from "express";
import { enqueueTask } from "../services/task.service";
import crypto from "crypto";

export const createTask = (req: Request, res: Response) => {
  try {
    const taskId = crypto.randomUUID();
    const { payload } = req.body;

    const result = enqueueTask(taskId, payload);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
