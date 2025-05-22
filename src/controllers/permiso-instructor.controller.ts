import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { PermisoInstructor } from '../entities/permiso-instructor.entity';
import { Instructor } from '../entities/instructor.entity';
import { Encargado } from '../entities/encargado.entity';

export const createPermisoInstructor = async (req: Request, res: Response) => {
  try {
    const { 
      idSenati, 
      apellidos, 
      dependencia, 
      cargo, 
      hora_salida, 
      hora_regreso, 
      motivo, 
      detalle_motivo, 
      encargadoId 
    } = req.body;

    // Validación básica
    if (!idSenati || !apellidos || !dependencia || !cargo || !hora_salida || !hora_regreso || !motivo || !encargadoId) {
      return res.status(400).json({ 
        message: 'Faltan campos obligatorios' 
      });
    }

    const instructorRepository = AppDataSource.getRepository(Instructor);
    const instructor = await instructorRepository.findOneBy({ idSenati });

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor no encontrado' });
    }

    const encargadoRepository = AppDataSource.getRepository(Encargado);
    const encargado = await encargadoRepository.findOneBy({ id: encargadoId });

    if (!encargado) {
      return res.status(404).json({ message: 'Encargado no encontrado' });
    }

    ////normalizar hora
    const normalizeTime = (timeString: string) => {
      if (!timeString.includes(':')) {
        throw new Error(`Formato de hora inválido: ${timeString}`);
      }
      return timeString.includes(':') && timeString.split(':').length === 2 
        ? `${timeString}:00` // Agrega segundos si faltan
        : timeString;
    };

    const permisoRepository = AppDataSource.getRepository(PermisoInstructor);
    const nuevoPermiso = permisoRepository.create({
      instructor,
      apellidos,
      dependencia,
      cargo,
      hora_salida : normalizeTime(hora_salida),
      hora_regreso : normalizeTime(hora_regreso),
      motivo,
      detalle_motivo,
      encargado,
      fechaCreacion: new Date()
    });

    await permisoRepository.save(nuevoPermiso);

    return res.status(201).json({
      message: 'Permiso creado exitosamente',
      data: nuevoPermiso
    });

    

  } catch (error) {
    console.error('Error al crear permiso:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};