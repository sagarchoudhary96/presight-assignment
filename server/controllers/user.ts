import type { Request, Response } from "express";
import { getUsers } from "@/services/user.service";

export const getAllUsers = (req: Request, res: Response) => {
  try {
    const result = getUsers(req.query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
