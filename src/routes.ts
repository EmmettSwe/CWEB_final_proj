import { RecipeController } from "./controller/RecipeController"
import {UserController} from "./controller/UserController";

export const Routes = [{
    method: "get",
    route: "/Recipe",
    controller: RecipeController,
    action: "all"
}, {
    method: "get",
    route: "/Recipe/:id",
    controller: RecipeController,
    action: "one"
}, {
    method: "post",
    route: "/Recipe",
    controller: RecipeController,
    action: "save"
}, {
    method: "delete",
    route: "/Recipe/:id",
    controller: RecipeController,
    action: "remove"
},{
    method: "put",
    route: "/Recipe",
    controller: RecipeController,
    action: "update"
},{
    method: "post",
    route: "/User",
    controller: UserController,
    action: "create"
},{
    method: "get",
    route: "/User",
    controller: UserController,
    action: "readAll"
},{
    method: "get",
    route: "/User/:id",
    controller: UserController,
    action: "readOne"
},{
    method: "put",
    route: "/User/:id",
    controller: UserController,
    action: "update"
},{
    method: "delete",
    route: "/User/:id",
    controller: UserController,
    action: "delete"
}]