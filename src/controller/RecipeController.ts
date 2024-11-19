import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import {Recipe} from "../entity/Recipe";
import {validate} from "class-validator";


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

        if (!Recipe) {// If we dont have a recipe return a msg
            return "unregistered Recipe"
        }
        return Recipe
    }

    //This is used for saving recipes to the database, it checks for authed users
    //  assigns an owner to the recipe
    //      makes a recipe object
    //          validates the object
    //              then saves it
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
        // Validate the user object
        const violations = await validate(recipe);

        // If there are any violations, return them
        if (violations.length > 0) {
            return violations
        }

        return this.recipeRepository.save(recipe)
    }
    //This is used to remove recipes from the database
    //  find the recipe
    //      authenticate the user
    //          and remove the recipe
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
    //This is used to update recipes
    //  first authenticate the user
    //      check for violations in the updated object
    //          save the updates object to the database
    async update(req: Request, res: Response, next: NextFunction) {
        const recipeToUpdate = await this.recipeRepository.preload(req.body);

        if (recipeToUpdate.owner !== req.user.userID) {
            res.status(401);
            res.json({message: "Unauthorized: Cannot update other users' recipes"});
            return
        }
        // Validate the user object
        const violations = await validate(recipeToUpdate);

        // If there are any violations, return them
        if (violations.length > 0) {
            Response.status(400).json(violations)
        }

        return this.recipeRepository.save(recipeToUpdate);
    }

}