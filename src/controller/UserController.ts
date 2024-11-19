import { AppDataSource} from "../data-source"
import { NextFunction, Request, Response } from "express"
import {User} from "../entity/User"
import {validate} from "class-validator";

/**
 * This is the controller for the User entity. It contains methods
 * for creating, reading, updating, and deleting users.
 */
export class UserController {

    // Get the user repository from AppDataSource
    private userRepository = AppDataSource.getRepository(User)

    /**
     * This method reads all users from the database.
     * route: GET /user
     * @param request
     * @param response
     * @param next
     */
    async readAll(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    /**
     * This method reads one user from the database.
     * route: GET /user/:id
     * @param request
     * @param response
     * @param next
     */
    async readOne(request: Request, response: Response, next: NextFunction) {
        const userID = parseInt(request.params.id)

        const user = await this.userRepository.findOne({
            where: { userID }
        })

        if (!user) {
            response.status(404).json({message: "User not found"})
            return
        }
        return user
    }

    /**
     * This method creates a new user in the database.
     * route: POST /user
     * @param request
     * @param response
     * @param next
     */
    async create(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, username, password } = request.body;
        const user = Object.assign(new User(), {
            firstName,
            lastName,
            username,
            password
        })

        // Validate the user object
        const violations = await validate(user);

        // If there are any violations, return them
        if (violations.length > 0) {
            return violations
        }

        // Check if the username already exists
        if (await this.userRepository.findOne({ where: { username } })) {
            response.status(400).json({message: "Username already exists"})
            return
        }

        await this.userRepository.save(user);
        response.json({ message: "User has been created" });
    }

    /**
     * This method deletes a user from the database.
     * The user must be signed in to delete their own account.
     * route: DELETE /user/:id
     * @param request
     * @param response
     * @param next
     */
    async delete(request: Request, response: Response, next: NextFunction) {
        const userID = parseInt(request.params.id)

        // Check if the user is signed in and the correct user
        if(userID !== request.user.userID) {
            request.status(401)
            response.json({message: "Unauthorized: Cannot delete other users"})
        }

        let userToRemove = await this.userRepository.findOneBy({ userID })

        if (!userToRemove) {
            return response.status(404).json({message: "User not found"})
        }

        await this.userRepository.remove(userToRemove)

        response.json({message: "User has been deleted"})
    }

    /**
     * This method updates a user in the database.
     * The user must be signed in to update their own account.
     * route: PUT /user/:id
     * @param request
     * @param response
     * @param next
     */
    async update(request: Request, response: Response, next: NextFunction) {
        const userID = parseInt(request.params.id)
        const { firstName, lastName, username, password } = request.body;

        // Create a new user object with updated values but same id
        let userToUpdate = Object.assign(new User(), {
            userID,
            firstName,
            lastName,
            username,
            password
        })

        // Check if the user is signed in and the correct user
        if(userToUpdate.userID !== request.user.userID) {
            response.status(401);
            response.json({message: "Unauthorized: Cannot update other users"});
        }

        // Validate the user object
        const violations = await validate(userToUpdate);

        // If there are any violations, return them
        if (violations.length > 0) {
            response.status(400).json(violations)
        }

        await this.userRepository.save(userToUpdate);

        response.json({message: "User has been updated"})
    }
}
