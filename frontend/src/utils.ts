import { GetRandomPostFunction } from "./types";

/**
 * Retrieves a random post from an array of posts.
 *
 * @param posts - An array of Post objects from which to select a random post.
 * @returns A randomly selected Post object from the provided array.
 *          If the array is empty, the behavior is undefined (may return undefined).
 */
export const getRandomPost: GetRandomPostFunction = (posts) => {
	const randomIndex = Math.floor(Math.random() * posts.length);
	return posts[randomIndex];
};
