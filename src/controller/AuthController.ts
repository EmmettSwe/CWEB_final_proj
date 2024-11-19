import {AppDataSource} from "../data-source"
import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User"
import * as jwt from "jsonwebtoken"

/**
 * This is the controller for authentication
 * It contains a method for logging in
 */
export class AuthController {

    private userRepository = AppDataSource.getRepository(User)

    /**
     * This method logs in a user
     * route: POST /login
     * @param request
     * @param response
     * @param next
     */
    async login(request: Request, response: Response, next: NextFunction) {
        const { username, password } = request.body;

        // Find the user by username
        const user = await this.userRepository.findOne({
            where: { username },
            // Select only the password and userID with select option
            // Because password is select:false we need to specify it here
            select:{ password: true, userID: true }
        })


        if (!user) {
            response.status(404)
            response.json({message: "User not found"})
            return
        }

        if (!await user.validatePassword(password)) {
            response.status(401)
            response.json({message: "Invalid password"})
            return
        }

        // Create a token adding the userID to the payload
        const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // Send the token
        response.json({token})
    }
}