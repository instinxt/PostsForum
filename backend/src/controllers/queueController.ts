// src/controllers/queueController.ts
import { getCurrentQueueSize } from "../services/queueService.js";
import { Request, Response } from "express";

/**
 * Get the size of message queue
 * @param req Request Object
 * @param res Response Object
 */
export const getQueueSize = async (req: Request, res: Response) => {
	const count = await getCurrentQueueSize();
	console.log("size of messageq:", count);
	res.status(200).json({ count });
};
