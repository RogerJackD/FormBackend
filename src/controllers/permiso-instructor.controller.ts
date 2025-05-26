import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { PermisoInstructor } from '../entities/permiso-instructor.entity';
import { Instructor } from '../entities/instructor.entity';
import { Encargado } from '../entities/encargado.entity';
import { ILike, Between } from "typeorm";

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

//Obtener los registros de permiso de intructores
export const getPermisosInstructores = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id_senati, apellidos, fecha } = req.query;
    const repo = AppDataSource.getRepository(PermisoInstructor);

    const where: any = {};

    if (id_senati) {
      where.instructor = {
        idSenati: Number(id_senati)
      };
    }

    if (apellidos) {
      where.apellidos = ILike(`%${apellidos}%`);
    }

    if (fecha) {
      const [year, month, day] = (fecha as string).split("-").map(Number);
      const inicio = new Date(year, month - 1, day, 0, 0, 0, 0);
      const fin = new Date(year, month - 1, day, 23, 59, 59, 999);
      where.fechaCreacion = Between(inicio, fin);
    }

    const permisos = await repo.find({
      where,
      relations: ['instructor', 'encargado'],
      order: { fechaCreacion: "DESC" },
    });

    return res.json(permisos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener permisos de instructores" });
  }
};

// Obtener permiso por ID
export const getPermisoInstructorporID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const repo = AppDataSource.getRepository(PermisoInstructor);
    const permiso = await repo.findOne({
      where: { id: Number(id) },
      relations: ['instructor', 'encargado'] // si quieres info relacionada
    });

    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    return res.json(permiso);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener permiso' });
  }
};

// Actualizar permiso por ID
export const updatePermisoInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    apellidos,
    dependencia,
    cargo,
    hora_salida,
    hora_regreso,
    motivo,
    detalle_motivo,
    encargadoId
  } = req.body;

  try {
    const repo = AppDataSource.getRepository(PermisoInstructor);
    const permiso = await repo.findOneBy({ id: Number(id) });

    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    // Actualizar campos (sin instructor, si quieres actualizar instructor tendrías que buscar el instructor también)
    permiso.apellidos = apellidos ?? permiso.apellidos;
    permiso.dependencia = dependencia ?? permiso.dependencia;
    permiso.cargo = cargo ?? permiso.cargo;
    permiso.hora_salida = hora_salida ?? permiso.hora_salida;
    permiso.hora_regreso = hora_regreso ?? permiso.hora_regreso;
    permiso.motivo = motivo ?? permiso.motivo;
    permiso.detalle_motivo = detalle_motivo ?? permiso.detalle_motivo;

    if (encargadoId) {
      const encargadoRepo = AppDataSource.getRepository(Encargado);
      const encargado = await encargadoRepo.findOneBy({ id: encargadoId });
      if (!encargado) {
        return res.status(404).json({ message: 'Encargado no encontrado' });
      }
      permiso.encargado = encargado;
    }

    await repo.save(permiso);
    return res.json({ message: 'Permiso actualizado', data: permiso });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar permiso' });
  }
};

// Eliminar permiso por ID
export const deletePermisoInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const repo = AppDataSource.getRepository(PermisoInstructor);
    const permiso = await repo.findOneBy({ id: Number(id) });

    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    await repo.remove(permiso);
    return res.json({ message: 'Permiso eliminado' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar permiso' });
  }
};
