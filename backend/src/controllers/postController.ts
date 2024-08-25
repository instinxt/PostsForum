// src/controllers/postController.ts
import { Request, Response } from "express";
import { Post } from "../models/Post.js";
import { getCurrentQueueSize, publishPost } from "../services/queueService.js";
import dotenv from "dotenv";
dotenv.config();

// cache middleware didn't work out, TODO: Figure out how to override res.json, facing type Issue
import redis from "redis";
import { PostData } from "../types.js";

const redisClient = redis.createClient({ url: process.env.REDIS_URL });

// Set up Redis client error handling
redisClient.on("error", (err) => {
	console.error("Redis error:", err);
});

redisClient.on("ready", () => console.log("Redis is ready"));

(async () => {
	await redisClient.connect();
	console.log("Connected to Redis");
})();

/**
 * Function to handle cache miss
 * @param data PostData Object
 * @param search Search String
 */
const cacheResponse = async (data: PostData[], search: string) => {
	// Cache the response data
	try {
		await redisClient.hSet(`posts:${search}`, "data", JSON.stringify(data));
		await redisClient.zAdd("lfu_cache", [
			{ value: `posts:${search}`, score: 1 },
		]); // Initialize access count
		await redisClient.expire(`posts:${search}`, 60); // Set expiration time (1 minute)
	} catch (err) {
		console.error("Error caching data...", err);
	}
};

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
		console.log("Status of Q", status);
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
	const cachedPosts = await redisClient.hGetAll(`posts:${search}`);
	const cachedPostSize = Object.keys(cachedPosts).length;

	if (cachedPostSize) {
		console.log("Cache Hit");
		await redisClient.zIncrBy("lfu_cache", 1, `posts:${search}`);
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
		await cacheResponse(posts as PostData[], search);
	} catch (e) {
		res.status(500).json({ message: "Caching error." });
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
