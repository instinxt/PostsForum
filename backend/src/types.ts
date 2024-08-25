// src/types.ts
export interface PostData {
	timestamp: string;
	title: string;
	message: string;
	context: string;
	tags: string[];
	location: string;
	images?: string[];
	externalLinks: string[];
	numLikes: number;
	numBookmarks: number;
	numViews: number;
}
