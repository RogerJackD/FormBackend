import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { PermisoMaterial } from '../entities/permiso-material.entity';
import { Instructor } from '../entities/instructor.entity';
import { Encargado } from '../entities/encargado.entity';
import { ILike, Between } from "typeorm";


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
//Obtener los registros de permiso de ingreso o salida de material

export const getPermisosMaterial = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, nombre_aprendiz, nombre_señor, accion, id_senati, fecha } = req.query;
    const repo = AppDataSource.getRepository(PermisoMaterial);

    const where: any = {};

    if (id) {
      where.id = Number(id);
    }

    if (nombre_aprendiz) {
      where.nombre_aprendiz = ILike(`%${nombre_aprendiz}%`);
    }

    if (nombre_señor) {
      where.nombre_señor = ILike(`%${nombre_señor}%`);
    }

    if (accion) {
      where.accion = ILike(`%${accion}%`);
    }

    if (id_senati) {
      where.instructor = {
        idSenati: Number(id_senati),
      };
    }

    if (fecha) {
      const [year, month, day] = (fecha as string).split("-").map(Number);
      const inicio = new Date(year, month - 1, day, 0, 0, 0, 0);
      const fin = new Date(year, month - 1, day, 23, 59, 59, 999);
      where.fechaCreacion = Between(inicio, fin);
    }

    const permisos = await repo.find({
      where,
      order: { fechaCreacion: "DESC" },
    });

    return res.json(permisos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener permisos de materiales" });
  }
};

export const getPermisoMaterialporID = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(PermisoMaterial);
    const permiso = await repo.findOne({ where: { id } });

    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    return res.json(permiso);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener permiso' });
  }
};

export const updatePermisoMaterial = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(PermisoMaterial);
    const permiso = await repo.findOne({ where: { id } });

    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    const {
      nombre_aprendiz,
      accion,
      detalle_accion,
      id_senati,
      nombre_señor,
      encargadoId
    } = req.body;

    // Actualización básica
    if (nombre_aprendiz !== undefined) permiso.nombre_aprendiz = nombre_aprendiz;
    if (accion !== undefined) permiso.accion = accion;
    if (detalle_accion !== undefined) permiso.detalle_accion = detalle_accion;
    if (nombre_señor !== undefined) permiso.nombre_señor = nombre_señor;

    if (id_senati) {
      const instructorRepo = AppDataSource.getRepository(Instructor);
      const instructor = await instructorRepo.findOneBy({ idSenati: id_senati });
      if (!instructor) return res.status(404).json({ message: 'Instructor no encontrado' });
      permiso.instructor = instructor;
    }

    if (encargadoId) {
      const encargadoRepo = AppDataSource.getRepository(Encargado);
      const encargado = await encargadoRepo.findOneBy({ id: encargadoId });
      if (!encargado) return res.status(404).json({ message: 'Encargado no encontrado' });
      permiso.encargado = encargado;
    }

    await repo.save(permiso);
    return res.json({ message: 'Permiso actualizado', data: permiso });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar permiso' });
  }
};

export const deletePermisoMaterial = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(PermisoMaterial);
    const permiso = await repo.findOne({ where: { id } });

    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    await repo.remove(permiso);
    return res.json({ message: 'Permiso eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar permiso' });
  }
};
