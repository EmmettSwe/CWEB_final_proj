import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm"
import {isNotEmpty, IsOptional, IsStrongPassword, minLength, MinLength} from "class-validator";

@Entity()
export class Recipe {

    @PrimaryGeneratedColumn()
    recipeID: number

    @Column({nullable: false, })
    @MinLength(3)
    title: string

    @CreateDateColumn({nullable: false})
    uploadDate: Date

    @Column({nullable: false})
    owner: number

    //Calories are optioanl so it is nullable
    @Column({nullable: true})
    @IsOptional()
    calories: number

    //The estimated time is optional so it is nullable
    @Column({nullable: true})
    @IsOptional()
    estimatedTime: number
    //We must have ingredients
    @Column({nullable: false})
    @MinLength(5)
    ingredients: string
    //We must have steps
    @Column({nullable: false})
    @MinLength(5)
    steps: string

}