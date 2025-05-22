import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { PermisoMaterial } from '../entities/permiso-material.entity';
import { Instructor } from '../entities/instructor.entity';
import { Encargado } from '../entities/encargado.entity';

export const createPermisoMaterial = async (req: Request, res: Response) => {
  try {
    const { 
      nombre_aprendiz,
      accion,
      detalle_accion,
      id_senati,  // Campo opcional
      nombre_señor,
      encargadoId // Campo obligatorio
    } = req.body;

    // Validación de campos obligatorios
    if (!accion || !encargadoId) {
      return res.status(400).json({
        message: 'Faltan campos obligatorios: accion, encargadoId' 
      });
    }

    const encargadoRepository = AppDataSource.getRepository(Encargado);
    const encargado = await encargadoRepository.findOneBy({ id: encargadoId });

    if (!encargado) {
      return res.status(404).json({ message: 'Encargado no encontrado' });
    }

    // Validación opcional: Si se envía id_senati, debe existir en Instructores
    let instructor: Instructor | null = null;
    if (id_senati) {
      const instructorRepository = AppDataSource.getRepository(Instructor);
      instructor = await instructorRepository.findOneBy({ idSenati: id_senati });
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor no encontrado con el id_senati proporcionado' });
      }
    }

    const permisoRepository = AppDataSource.getRepository(PermisoMaterial);
    const nuevoPermiso = permisoRepository.create({
      nombre_aprendiz,
      accion,
      detalle_accion: detalle_accion || null,
      instructor: instructor || undefined,  // Puede ser null
      nombre_señor,
      encargado,   // Obligatorio
      fechaCreacion: new Date()
    });

    await permisoRepository.save(nuevoPermiso);

    return res.status(201).json({
      message: 'Permiso de materiales creado exitosamente',
      data: nuevoPermiso
    });

  } catch (error) {
    console.error('Error al crear permiso de materiales:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};