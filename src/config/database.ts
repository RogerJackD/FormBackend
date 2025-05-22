import { DataSource } from "typeorm"; // Import explícito
import { Encargado } from "../entities/encargado.entity";
import { Instructor } from "../entities/instructor.entity";
import { PermisoInstructor } from "../entities/permiso-instructor.entity"
import { PermisoMaterial } from "../entities/permiso-material.entity"
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [Encargado, Instructor, PermisoInstructor, PermisoMaterial],
  migrations: [],
});