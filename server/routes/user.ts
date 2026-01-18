import { Router } from "express";
import { getAllUsers, getFilters } from "../controllers/user";

const router = Router();

router.get("/filters", getFilters);
router.get("/", getAllUsers);

export default router;
