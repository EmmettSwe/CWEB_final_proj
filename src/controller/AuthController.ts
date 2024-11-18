import {AppDataSource} from "../data-source"
import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User"
import * as jwt from "jsonwebtoken"



export class AuthController {

    private userRepository = AppDataSource.getRepository(User)

    async login(request: Request, response: Response, next: NextFunction) {
        const { username, password } = request.body;

        const user = await this.userRepository.findOne({
            where: { username }
        })

        if (!user) {
            response.status(404)
            return response.json({message: "User not found"})
        }

        if (!await user.validatePassword(password)) {
            response.status(401)
            return response.json({message: "Invalid password"})
        }

        const token = jwt.sign({userID: user.userID}, process.env.JWT_SECRET, {expiresIn: "1h"})
        return response.json({token})
    }
}