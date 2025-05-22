import { DataSource } from "typeorm"; // Import explícito
import { Encargado } from "../entities/encargado.entity";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [Encargado],
  migrations: [],
});