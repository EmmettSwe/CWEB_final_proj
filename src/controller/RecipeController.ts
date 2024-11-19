import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import {Recipe} from "../entity/Recipe";

export class RecipeController {

    private recipeRepository = AppDataSource.getRepository(Recipe)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.recipeRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const recipeID = parseInt(request.params.id)


        const Recipe = await this.recipeRepository.findOne({
            where: { recipeID }
        })

        if (!Recipe) {
            return "unregistered Recipe"
        }
        return Recipe
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { title, uploadDate, calories, estimatedTime, ingredients, steps } = request.body;

        if (!request.user) {
            response.status(401).json({message: "Unauthorized: Must be signed in to create a recipe"})
            return
        }

        const owner = request.user.userID
        const recipe = Object.assign(new Recipe(), {
            title,
            uploadDate,
            owner,
            calories,
            estimatedTime,
            ingredients,
            steps
        })

        return this.recipeRepository.save(recipe)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const recipeID = parseInt(request.params.id)

        let recipeToRemove = await this.recipeRepository.findOneBy({ recipeID })

        if (!recipeToRemove) {
            return "this recipe doesn't exist"
        }

        if (request.user.userID !== recipeToRemove.owner) {
            response.status(401).json({message: "Unauthorized: Cannot delete other users' recipes"})
            return
        }

        await this.recipeRepository.remove(recipeToRemove)

        response.json({message: "recipe has been removed"})
    }
    async update(req: Request, res: Response, next: NextFunction) {
        const recipeToUpdate = await this.recipeRepository.preload(req.body);

        if (recipeToUpdate.owner !== req.user.userID) {
            res.status(401);
            res.json({message: "Unauthorized: Cannot update other users' recipes"});
            return
        }

        return this.recipeRepository.save(recipeToUpdate);
    }

}