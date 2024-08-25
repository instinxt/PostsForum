// src/server.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import { consumePosts } from "./services/queueService.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", postRoutes);

const startServer = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI!);
		console.log("Connected to MongoDB");

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
			new Promise((res, rej) => {
				setTimeout(() => {
					res("");
				}, 1000);
			}).then(consumePosts);
			// Start consuming posts
		});
	} catch (err) {
		console.error("MongoDB connection error:", err);
	}
};

startServer();
