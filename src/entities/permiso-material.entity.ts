import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Instructor } from './instructor.entity';
import { Encargado } from './encargado.entity';

@Entity('permiso_materiales')
export class PermisoMaterial {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  nombre_aprendiz!: string;

  @Column({ type: 'varchar', length: 100 })
  accion!: string;

  @Column({ type: 'text', nullable: true })
  detalle_accion?: string;

  // Relación Opcional con Instructor (id_senati puede ser null)
  @ManyToOne(() => Instructor, (instructor) => instructor.permisosMateriales, { 
    nullable: true 
  })
  @JoinColumn({ name: 'id_senati', referencedColumnName: 'idSenati' })
  instructor?: Instructor;

  @Column({ type: 'varchar', length: 100 })
  nombre_señor!: string;

  // Relación Obligatoria con Encargado
  @ManyToOne(() => Encargado, (encargado) => encargado.permisosMateriales)
  @JoinColumn({ name: 'encargado_id' })
  encargado!: Encargado;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion!: Date;

  @Column({ type: 'boolean', default: false })
  anulado!: boolean;
}