import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { Instructor } from "./instructor.entity"
import { PermisoInstructor } from './permiso-instructor.entity';
import { PermisoMaterial } from './permiso-material.entity';

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

  @CreateDateColumn({ name: "fecha_creacion", type: 'timestamp' })
  fechaCreacion!: Date;

  // Relación uno-a-muchos con Instructores 
  @OneToMany(() => Instructor, (instructor) => instructor.encargado)
  instructores!: Instructor[];
  // Relación uno-a-muchos con permiso Instructores
  @OneToMany(() => PermisoInstructor, (permiso) => permiso.encargado)
  permisosInstructores!: PermisoInstructor[];
  // Relación uno-a-muchos con Instructores-material
  @OneToMany(() => PermisoMaterial, (permiso) => permiso.instructor)
  permisosMateriales!: PermisoMaterial[];
}