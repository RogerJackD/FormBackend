import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Encargado } from './encargado.entity';
import { PermisoInstructor } from './permiso-instructor.entity';
import { PermisoMaterial } from './permiso-material.entity';

@Entity('instructores') // Nombre exacto de la tabla en la base de datos
export class Instructor {
  @PrimaryGeneratedColumn()
  id!: number; // Este campo lo maneja automáticamente la base de datos

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos!: string;

  @Column({ name: 'id_senati', type: 'varchar', length: 50, unique: true })
  idSenati!: string; // Nota: usamos camelCase en el código pero se mapea a snake_case en BD

  @Column({ type: 'varchar', length: 100 })
  curso!: string;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion!: Date; // Se autogenera con la fecha actual

  // Relación Many-to-One con Encargado
  @ManyToOne(() => Encargado, (encargado) => encargado.instructores)
  @JoinColumn({ name: 'encargado_id' }) // Nombre de la columna FK en la tabla
  encargado!: Encargado;

  // Relación One-to-Many con PermisoInstructor 
  @OneToMany(() => PermisoInstructor, (permiso) => permiso.instructor)
  permisos!: PermisoInstructor[];
  // Relación One-to-Many con Permisomaterial 
  @OneToMany(() => PermisoMaterial, (permiso) => permiso.instructor)
  permisosMateriales!: PermisoMaterial[];
  
}