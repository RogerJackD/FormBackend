import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("encargados") // Nombre exacto de la tabla en PostgreSQL
export class Encargado {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombres!: string;

  @Column()
  apellidos!: string;

  @Column()
  contrasena!: string;

  @Column()
  usuario!: string;

  @Column({ name: "fecha_creacion" }) 
  fechaCreacion!: Date;
}