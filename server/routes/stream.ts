import { Router } from "express";
import { streamText } from "../controllers/stream";

const router = Router();

router.get("/", streamText);

export default router;
