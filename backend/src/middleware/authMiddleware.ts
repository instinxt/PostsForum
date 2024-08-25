// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token
 * @param req Request object
 * @param res Response object
 * @param next Next middleware function
 */
export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.body;
	// For system user Bypass authentication for createPost route
	if (userId === "hardcoded_user_id") {
		next();
	} else {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) {
			return res.status(401).json({ message: "No token provided." });
		}

		try {
			jwt.verify(token, process.env.JWT_SECRET!);
			// In proper setup you would attach the user to the request
			next();
		} catch (err) {
			return res.status(403).json({ message: "Failed to authenticate token." });
		}
	}
};
