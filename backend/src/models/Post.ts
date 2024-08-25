// src/models/Post.ts
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
	timestamp: { type: String, required: true },
	title: { type: String, required: true },
	message: { type: String, required: true },
	context: { type: String },
	tags: { type: [String] },
	location: { type: String },
	images: { type: [String] },
	externalLinks: { type: [String] },
	numLikes: { type: Number, default: 0 },
	numBookmarks: { type: Number, default: 0 },
	numViews: { type: Number, default: 0 },
});

export const Post = mongoose.model("Post", PostSchema);
