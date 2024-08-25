// src/routes/postRoutes.ts
import { Router } from "express";
import {
	createPost,
	fetchPosts,
	getPostCount,
} from "../controllers/postController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { getQueueSize } from "../controllers/queueController.js";

const router = Router();

router.post("/posts", verifyToken, createPost);
router.get("/posts", fetchPosts);
router.get("/posts/count", getPostCount);
router.get("/posts/qSize", getQueueSize);

export default router;
