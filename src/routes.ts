import { RecipeController } from "./controller/RecipeController"
import {UserController} from "./controller/UserController";
import {AuthController} from "./controller/AuthController";

/**
 * This is the routes file. It contains all of the routes for the application.
 * The needAuth property is used to determine if a route requires authentication.
 */
export const Routes = [{
    method: "get",
    route: "/Recipe",
    controller: RecipeController,
    action: "all",
    needAuth: false
}, {
    method: "get",
    route: "/Recipe/:id",
    controller: RecipeController,
    action: "one",
    needAuth: false
}, {
    method: "post",
    route: "/Recipe",
    controller: RecipeController,
    action: "save",
    needAuth: true
}, {
    method: "delete",
    route: "/Recipe/:id",
    controller: RecipeController,
    action: "remove",
    needAuth: true
},{
    method: "put",
    route: "/Recipe",
    controller: RecipeController,
    action: "update",
    needAuth: true
},{
    method: "post",
    route: "/User",
    controller: UserController,
    action: "create",
    needAuth: false
},{
    method: "get",
    route: "/User",
    controller: UserController,
    action: "readAll",
    needAuth: false
},{
    method: "get",
    route: "/User/:id",
    controller: UserController,
    action: "readOne",
    needAuth: false
},{
    method: "put",
    route: "/User/:id",
    controller: UserController,
    action: "update",
    needAuth: true
},{
    method: "delete",
    route: "/User/:id",
    controller: UserController,
    action: "delete",
    needAuth: true
},{
    method: "post",
    route: "/login",
    controller: AuthController,
    action: "login",
    needAuth: false
}]