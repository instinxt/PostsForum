// src/controllers/postController.ts
import { Request, Response } from "express";
import { Post } from "../models/Post.js";
import { publishPost } from "../services/queueService.js";
import { PostData } from "../types.js";
import { getCacheData, storeInCache } from "../services/cacheService.js";

/**
 * Create a new post
 * @param req Request object
 * @param res Response object
 */
export const createPost = async (req: Request, res: Response) => {
	const postData = req.body;

	// Simulate a long-running task
	await new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve("long running process");
		}, 500);
	});

	try {
		const status = await publishPost(postData);
		if (!status) {
			res.status(500).json({ message: "Failed to queue post." });
			return;
		}

		res.status(201).json({ message: "Post queued for creation." });
	} catch (error) {
		res.status(500).json({ message: "Failed to queue post." });
	}
};

/**
 * Fetch all posts with optional search
 * @param req Request object
 * @param res Response object
 */
export const fetchPosts = async (req: Request, res: Response) => {
	const search = (req.query.search as string).trim().toLowerCase();

	// Check if the result is in the cache
	const cachedPosts = await getCacheData(search);
	const cachedPostSize = Object.keys(cachedPosts).length;

	if (cachedPostSize) {
		console.log("Cache Hit");
		res.status(200).json(JSON.parse(cachedPosts.data));
		return;
	}
	console.log("Cache Miss");

	const query = search
		? {
				$or: [
					{ title: { $regex: search, $options: "i" } },
					{ message: { $regex: search, $options: "i" } },
				],
		  }
		: {};
	const posts = await Post.find(query);

	if (posts.length === 0) {
		return res.status(204).json({ message: "No posts found." });
	}

	try {
		await storeInCache(posts as PostData[], search);
	} catch (e) {
		res.status(500).json({ message: "Server processing issue" });
	}

	return res.status(200).json(posts);
};

/**
 * Get the count of posts
 * @param req Request object
 * @param res Response object
 */
export const getPostCount = async (req: Request, res: Response) => {
	try {
		const count = await Post.countDocuments();
		res.status(200).json({ count });
	} catch (err) {
		console.error("Failed to get db posts count...", err);
	}
};
