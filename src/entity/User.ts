import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm"
import * as bcrypt from "bcrypt"
import {IsOptional, IsStrongPassword, MinLength} from "class-validator";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    @IsOptional()
    userID: number

    @Column({nullable: false})
    @MinLength(2)
    firstName: string

    @Column({nullable: false})
    @MinLength(2)
    lastName: string

    // Specifying this as unique makes it so that no two users can have the same username
    @Column({nullable: false, unique: true})
    @MinLength(6)
    username: string

    // Specifying this as select:false makes it so that the password is not returned in queries (for security)
    @Column({nullable: false, select: false})
    // This makes it so there must be:
    // at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
    @IsStrongPassword()
    password: string

    // This method runs before adding a user to the database
    @BeforeInsert()
    async hashPassword() {
        // Hash the password with a salt of 12 using the bcrypt module
        this.password = await bcrypt.hash(this.password, 12)
    }

    // This method validates a password to the hashed password using bcrypt
    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password)
    }

}
