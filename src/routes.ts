import { RecipeController } from "./controller/RecipeController"

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
}]