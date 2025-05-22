import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Instructor } from './instructor.entity';
import { Encargado } from './encargado.entity';

@Entity('permiso_instructores')
export class PermisoInstructor {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación Many-to-One con Instructor (a través de id_senati)
  @ManyToOne(() => Instructor, (instructor) => instructor.permisos)
  @JoinColumn({ name: 'id_senati', referencedColumnName: 'idSenati' }) // Relación por id_senati
  instructor!: Instructor;

  @Column({ type: 'varchar', length: 100 })
  apellidos!: string;

  @Column({ type: 'varchar', length: 100 })
  dependencia!: string;

  @Column({ type: 'varchar', length: 100 })
  cargo!: string;

  @Column({ type: 'time' })
  hora_salida!: string;

  @Column({ type: 'time' })
  hora_regreso!: string;

  @Column({ type: 'varchar', length: 200 })
  motivo!: string;

  @Column({ type: 'text', nullable: true })
  detalle_motivo?: string;

  // Relación Many-to-One con Encargado
  @ManyToOne(() => Encargado, (encargado) => encargado.permisosInstructores)
  @JoinColumn({ name: 'encargado_id' })
  encargado!: Encargado;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion!: Date;
}