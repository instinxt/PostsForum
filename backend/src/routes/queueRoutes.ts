import { Router } from "express";
import { getQueueSize } from "../controllers/queueController.js";
const router = Router();

router.get("/queue/size", getQueueSize);

export default router;
