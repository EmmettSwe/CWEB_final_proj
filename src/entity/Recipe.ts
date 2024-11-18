import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm"

@Entity()
export class Recipe {

    @PrimaryGeneratedColumn()
    recipeID: number

    @Column({nullable: false, })
    title: string

    @CreateDateColumn({nullable: false})
    uploadDate: Date

    @Column({nullable: false})
    owner: number

    @Column({nullable: true})
    calories: number

    @Column({nullable: true})
    estimatedTime: number

    @Column({nullable: false})
    ingredients: string

    @Column({nullable: false})
    steps: string

}