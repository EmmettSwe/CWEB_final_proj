import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

/**
 * This middleware checks if the request has a valid JWT token.
 * If the token is valid, the userID is added to the request object.
 * @param request
 * @param response
 * @param next
 */
export const authenticate = (request: Request, response: Response, next: NextFunction) => {
    // Get the token from the request headers
    const token = request.headers.authorization;

    // If there is no token, return an unauthorized response
    if (!token) {
        response.status(401);
        return response.json({ message: "Unauthorized" });
    }

    try {
        // decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If the token is invalid return an unauthorized response
        if(!decoded) {
            response.status(401);
            response.json({ message: "Unauthorized" });
            return
        }

        // Add the user to the request object
        request.user = decoded;
        // Go to the route
        next();
    } catch (error) {
        response.status(401);
        response.json({ message: "Unauthorized" });
    }
}