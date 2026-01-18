import type { Request, Response } from "express";
import { generateStreamText } from "@/services/stream.service";

export const streamText = async (req: Request, res: Response) => {
  try {
    const text = generateStreamText();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    // Send the response character by character with a minimal delay
    for (const char of text) {
      res.write(char);
      // Minimal delay to ensure streaming visibility without being too slow
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    res.end();
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    } else {
      res.end();
    }
  }
};
