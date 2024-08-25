import { GetRandomPostFunction } from "./types";

export const getRandomPost: GetRandomPostFunction = (posts) => {
	const randomIndex = Math.floor(Math.random() * posts.length);
	return posts[randomIndex];
};
