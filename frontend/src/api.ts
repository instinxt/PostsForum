// src/api.ts
import axios from "axios";
import { Post } from "./types";

const API_URL = "http://localhost:5000/api";

/**
 * Creates a new post.
 *
 * @param post - The post object to be created.
 * @returns A promise that resolves when the post is successfully created.
 * @throws Will throw an error if the request fails.
 */
export const createPost = async (post: Post): Promise<void> => {
	const userId = "hardcoded_user_id"; // Use the hardcoded user ID
	await axios.post(`${API_URL}/posts`, { ...post, userId });
};

/**
 * Fetches posts from the database based on a search term.
 *
 * @param searchTerm - The term to search for in the posts.
 * @returns A promise that resolves to an array of posts matching the search term,
 *          or void if an error occurs.
 * @throws Will log an error to the console if the request fails.
 */
export const fetchPosts = async (
	searchTerm: string
): Promise<Post[] | void> => {
	try {
		const response = await axios.get(`${API_URL}/posts`, {
			params: { search: searchTerm },
		});
		return response.data;
	} catch (err) {
		console.log("error", err);
	}
};

/**
 * Retrieves the total count of posts in database.
 *
 * @returns A promise that resolves to the number of posts.
 * @throws Will throw an error if the request fails.
 */
export const getPostCount = async (): Promise<number> => {
	const response = await axios.get(`${API_URL}/posts/count`);
	return response.data.count;
};

/**
 * Retrieves the current size of the message queue.
 *
 * @returns A promise that resolves to the number of items in the post queue.
 * @throws Will throw an error if the request fails.
 */
export const getQueueSize = async (): Promise<number> => {
	const response = await axios.get(`${API_URL}/posts/qSize`);
	return response.data.count;
};
