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
        const { title, uploadDate, owner, calories, estimatedTime, ingredients, steps } = request.body;
        console.log(request.body);
        const user = Object.assign(new Recipe(), {
            title,
            uploadDate,
            owner,
            calories,
            estimatedTime,
            ingredients,
            steps
        })

        return this.recipeRepository.save(user)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const recipeID = parseInt(request.params.id)

        let recipeToRemove = await this.recipeRepository.findOneBy({ recipeID })

        if (!recipeToRemove) {
            return "this recipe not exist"
        }

        await this.recipeRepository.remove(recipeToRemove)

        return "recipe has been removed"
    }

}