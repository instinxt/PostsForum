import redis from "redis";
import dotenv from "dotenv";
import { PostData } from "../types.js";
dotenv.config();

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
export const storeInCache = async (
	data: PostData[],
	search: string
): Promise<void> => {
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
 * Function to return cached data
 * @param searchTerm Search string requested
 * @returns Promise<any> Cached posts
 */
export const getCacheData = async (searchTerm: string): Promise<any> => {
	const cachedPosts = await redisClient.hGetAll(`posts:${searchTerm}`);
	await redisClient.zIncrBy("lfu_cache", 1, `posts:${searchTerm}`); // Increment access count
	return cachedPosts;
};
