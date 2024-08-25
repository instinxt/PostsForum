// src/api.ts
import axios from "axios";
import { Post } from "./types";

const API_URL = "http://localhost:5000/api";

export const createPost = async (post: Post): Promise<void> => {
	const userId = "hardcoded_user_id"; // Use the hardcoded user ID
	await axios.post(`${API_URL}/posts`, { ...post, userId });
};

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

export const getPostCount = async (): Promise<number> => {
	const response = await axios.get(`${API_URL}/posts/count`);
	return response.data.count;
};

export const getQueueSize = async (): Promise<number> => {
	const response = await axios.get(`${API_URL}/posts/qSize`);
	return response.data.count;
};
