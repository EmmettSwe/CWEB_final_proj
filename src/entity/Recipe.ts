import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Recipe {

    @PrimaryGeneratedColumn()
    recipeID: number

    @Column()
    title: string

    @Column()
    uploadDate: Date

    @Column()
    owner: number

    @Column()
    calories: number

    @Column()
    estimatedTime: number

    @Column()
    ingredients: string

    @Column()
    steps: string

}