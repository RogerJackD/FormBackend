import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Encargado } from './encargado.entity';

@Entity('permiso_aprendices')
export class PermisoAprendiz {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  nombres!: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos!: string;

  @Column({ type: 'varchar', length: 100 })
  ocupacion!: string;

  @Column({ type: 'varchar', length: 50 })
  grupo!: string;

  @Column({ type: 'varchar', length: 100 })
  programa!: string;

  @Column({ type: 'text' })
  motivo!: string;

  @Column({ type: 'time' })
  hora_salida!: string; // Formato: 'HH:MM:SS'

  @Column({ type: 'time' })
  hora_retorno!: string; // Formato: 'HH:MM:SS'

  @Column({ type: 'varchar', length: 50 })
  tiempo_permiso!: string; // Ej: "2 horas"

  // Relación Many-to-One con Encargado (obligatoria)
  @ManyToOne(() => Encargado, (encargado) => encargado.permisosAprendices)
  @JoinColumn({ name: 'encargado_id' })
  encargado!: Encargado;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion!: Date;
}