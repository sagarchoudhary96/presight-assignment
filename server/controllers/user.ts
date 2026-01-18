import type { Request, Response } from "express";
import { getFilterMetadata, getUsers } from "@/services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = getUsers(req.query);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilters = (req: Request, res: Response) => {
  try {
    const result = getFilterMetadata();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
