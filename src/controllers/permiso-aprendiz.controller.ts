import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { PermisoAprendiz } from '../entities/permiso-aprendiz.entity';
import { Encargado } from '../entities/encargado.entity';
import { ILike, Between } from "typeorm";
import { formatearFecha } from '../utils/formatFecha';

export const createPermisoAprendiz = async (req: Request, res: Response) => {
  try {
    const { 
      nombres,
      apellidos,
      ocupacion,
      grupo,
      programa,
      motivo,
      hora_salida,
      hora_retorno,
      tiempo_permiso,
      encargadoId
    } = req.body;

    // Validación de campos obligatorios
    if (!nombres || !apellidos || !ocupacion || !grupo || !programa || !motivo || 
        !hora_salida || !hora_retorno || !tiempo_permiso || !encargadoId) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios' 
      });
    }

    // Validación de formato de hora (HH:MM o HH:MM:SS)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeRegex.test(hora_salida) || !timeRegex.test(hora_retorno)) {
      return res.status(400).json({ 
        message: 'Formato de hora inválido. Use HH:MM o HH:MM:SS' 
      });
    }

    const encargadoRepository = AppDataSource.getRepository(Encargado);
    const encargado = await encargadoRepository.findOneBy({ id: encargadoId });

    if (!encargado) {
      return res.status(404).json({ message: 'Encargado no encontrado' });
    }

    const permisoRepository = AppDataSource.getRepository(PermisoAprendiz);
    const nuevoPermiso = permisoRepository.create({
      nombres,
      apellidos,
      ocupacion,
      grupo,
      programa,
      motivo,
      hora_salida: hora_salida.includes(':') ? hora_salida : `${hora_salida}:00`, // Normaliza
      hora_retorno: hora_retorno.includes(':') ? hora_retorno : `${hora_retorno}:00`,
      tiempo_permiso,
      encargado,
      fechaCreacion: new Date()
    });

    await permisoRepository.save(nuevoPermiso);

    return res.status(201).json({
      message: 'Permiso de aprendiz creado exitosamente',
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
/////////////////////////////////////////////////////////////////////metodo get
export const getPermisosAprendices = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, nombre, fecha, anulado } = req.query;
    const repo = AppDataSource.getRepository(PermisoAprendiz);

    const where: any = {};

    if (id) {
      where.id = Number(id);
    }

    if (nombre) {
      where.nombres = ILike(`%${nombre}%`);
    }

    if (fecha) {
  const [year, month, day] = (fecha as string).split("-").map(Number);
  const inicio = new Date(year, month - 1, day, 0, 0, 0, 0);
  const fin = new Date(year, month - 1, day, 23, 59, 59, 999);

  where.fechaCreacion = Between(inicio, fin);
}

    // Por defecto muestra permisos no anulados, query ?anulado='true' para ver solo los permisos anulados
    if (anulado === 'true') {
      where.anulado = true;
    } else {
      where.anulado = false;
    }

    const permisos = await repo.find({
      where,
      order: { fechaCreacion: "DESC" },
    });

    const permisosFormateados = permisos.map(p => ({
  ...p,
  fechaCreacion: formatearFecha(p.fechaCreacion)
}));

return res.json(permisosFormateados);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al filtrar permisos de aprendices" });
  }
};

// Filtrar Formulario por ID
export const getPermisoAprendizporID = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  // Verifica que sea un número válido
  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const repo = AppDataSource.getRepository(PermisoAprendiz);
  const permiso = await repo.findOne({ where: { id } });

  if (!permiso) {
    return res.status(404).json({ message: "Permiso no encontrado" });
  }

  return res.json({
  ...permiso,
  fechaCreacion: formatearFecha(permiso.fechaCreacion)
});
};

// Editar un formulario
export const updatePermisoAprendiz = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const repo = AppDataSource.getRepository(PermisoAprendiz);

  let permiso = await repo.findOneBy({ id });
  if (!permiso) {
    return res.status(404).json({ message: "Permiso no encontrado" });
  }

  // Actualizar campos permitidos
  repo.merge(permiso, req.body);

  try {
    const result = await repo.save(permiso);
    return res.json({
      message: "Permiso actualizado correctamente",
      data: result
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
    return res.status(500).json({ message: "Error al actualizar permiso" });
  }
};

// Soft delete con PATCH
export const softDeletePermisoAprendiz = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(PermisoAprendiz);

    const permiso = await repo.findOne({ where: { id } });

    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    permiso.anulado = true;
    await repo.save(permiso);

    return res.json({ message: 'Permiso marcado como anulado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al marcar como eliminado' });
  }
};

// Restaurar un soft delete con PATCH
export const restaurarPermisoAprendiz = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(PermisoAprendiz);

    const permiso = await repo.findOne({ where: { id } });

    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    permiso.anulado = false;
    await repo.save(permiso);

    return res.json({ message: 'Permiso restaurado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al revertir el anulado' });
  }
};

// Eliminar un formulario
export const deletePermisoAprendiz = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const repo = AppDataSource.getRepository(PermisoAprendiz);

  const result = await repo.delete(id);
  if (result.affected === 0) {
    return res.status(404).json({ message: "Permiso no encontrado" });
  }

  return res.json({ message: "Permiso eliminado correctamente" });
};
