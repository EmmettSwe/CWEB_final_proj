import { DataSource } from 'typeorm';
import {Recipe} from "./entity/Recipe"; // Adjust the import path as necessary
export const AppDataSource = new DataSource({
    type: 'sqlite', // e.g., 'mysql', 'postgres', etc.
    database: './database.sqlite',
    synchronize: true,
    logging: false,
    entities: [ Recipe],
    migrations: [], // Add your migration files here
    subscribers: [], // Add your subscriber files here
});