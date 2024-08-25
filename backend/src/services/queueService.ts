// src/services/queueService.ts
import amqp, { Channel, ConfirmChannel, Connection } from "amqplib";
import { Post } from "../models/Post.js";
import { PostData } from "../types.js";
import dotenv from "dotenv";
dotenv.config();

const QUEUE_NAME = "postQueue";
const MAX_QUEUE_SIZE = 20; // Set your desired max length here

let channel: ConfirmChannel | null = null;

// Connect to RabbitMQ and create a channel
const connectRabbitMQ = async (): Promise<void> => {
	try {
		const connection: Connection = await amqp.connect(
			process.env.RABBITMQ_URL!
		);
		channel = await connection.createConfirmChannel();
		await channel.assertQueue(QUEUE_NAME, {
			arguments: {
				"x-max-length": MAX_QUEUE_SIZE, // Limit the queue size
				"x-overflow": "reject-publish", // Reject new messages when the limit is reached
			},
		});

		// Set prefetch count to control the number of unacknowledged messages
		channel.prefetch(1); // Only one message at a time

		connection.on("close", () => {
			console.error("Connection closed, attempting to reconnect...");
			setTimeout(connectRabbitMQ, 5000); // Retry after 5 seconds
		});

		console.log("Connected to RabbitMQ");
	} catch (error) {
		console.error("Failed to connect to RabbitMQ:", error);
		setTimeout(connectRabbitMQ, 5000); // Retry on failure
	}
};

/**
 * Publish post to RabbitMQ and return status
 * @param postData Post data to publish
 */
export const publishPost = async (postData: PostData): Promise<boolean> => {
	if (!channel) {
		throw new Error(
			"Channel is not initialized. Ensure connectRabbitMQ is called first."
		);
	}

	let publishStatus = true;
	channel.sendToQueue(
		QUEUE_NAME,
		Buffer.from(JSON.stringify(postData)),
		{},
		(err, ok) => {
			if (err) {
				console.error("Message was rejected");
			} else {
				console.log("Message was sent successfully:");
			}
		}
	);

	try {
		await channel.waitForConfirms();
		return publishStatus;
	} catch (err) {
		console.error("Failed to confirm messages:", err);
		return false;
	}
};

/**
 * Consume posts from the queue
 */
export const consumePosts = async (): Promise<void> => {
	// Connect to RabbitMQ and start consuming
	await connectRabbitMQ();
	if (!channel) {
		throw new Error(
			"Channel is not initialized. Ensure connectRabbitMQ is called first."
		);
	}

	await channel.consume(
		QUEUE_NAME,
		async (msg) => {
			if (msg) {
				try {
					const postData: PostData = JSON.parse(msg.content.toString());
					const post = new Post(postData);

					// Long message processing
					await new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve("long running process");
						}, 1000);
					});

					await post.save();
					channel!.ack(msg); // Acknowledge the message after successful processing
				} catch (error) {
					console.error("Error processing message:", error);
					channel!.nack(msg); // Optionally, negatively acknowledge the message to requeue it
				}
			}
		},
		{ noAck: false }
	); // Ensure automatic acknowledgment is disabled
};

/**
 * Get the size of the RabbitMQ queue
 * @param queueName Name of the queue
 * @returns Promise<number> Queue size
 */
export const getCurrentQueueSize = async (): Promise<number> => {
	if (!channel) {
		throw new Error(
			"Channel is not initialized. Ensure connectRabbitMQ is called first."
		);
	}

	try {
		const { messageCount } = await channel.checkQueue(QUEUE_NAME);
		return messageCount;
	} catch (err) {
		console.error("Error getting queue size:", err);
		throw err;
	}
};
