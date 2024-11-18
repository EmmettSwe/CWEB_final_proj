import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm"
import * as bcrypt from "bcrypt"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    userID: number

    @Column({nullable: false})
    firstName: string

    @Column({nullable: false})
    lastName: string

    @Column({nullable: false})
    username: string

    @Column({nullable: false})
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12)
    }

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password)
    }

}
