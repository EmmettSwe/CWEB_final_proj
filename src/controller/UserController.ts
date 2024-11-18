import { AppDataSource} from "../data-source"
import { NextFunction, Request, Response } from "express"
import {User} from "../entity/User"

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    async readAll(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async readOne(request: Request, response: Response, next: NextFunction) {
        const userID = parseInt(request.params.id)

        const user = await this.userRepository.findOne({
            where: { userID }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async create(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, username, password } = request.body;
        const user = Object.assign(new User(), {
            firstName,
            lastName,
            username,
            password
        })

        return this.userRepository.save(user)
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const userID = parseInt(request.params.id)

        if(userID !== request.user.userID) {
            request.status(401)
            return response.json({message: "Unauthorized: Cannot delete other users"})
        }

        let userToRemove = await this.userRepository.findOneBy({ userID })

        if (!userToRemove) {
            return "this user doesn't exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }
    async update(req: Request, res: Response, next: NextFunction) {
        const userToUpdate = await this.userRepository.preload(req.body);

        if(userToUpdate.userID !== req.user.userID) {
            res.status(401);
            return res.json({message: "Unauthorized: Cannot update other users"});
        }

        return this.userRepository.save(userToUpdate);
    }
}
