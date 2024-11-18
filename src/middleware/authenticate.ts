import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const authentication = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization;

    if (!token) {
        response.status(401);
        return response.json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            response.status(401);
            return response.json({ message: "Unauthorized" });
        }

        request.user = decoded;
        next();
    } catch (error) {
        response.status(401);
        return response.json({ message: "Unauthorized" });
    }
}