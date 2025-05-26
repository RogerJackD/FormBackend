import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Instructor } from '../entities/instructor.entity';
import { Encargado } from '../entities/encargado.entity';
import { ILike } from "typeorm";


export const createInstructor = async (req: Request, res: Response) => {
  try {
    const { nombre, apellidos, idSenati, curso, encargadoId } = req.body;

    // Validación básica
    if (!nombre || !apellidos || !idSenati || !curso || !encargadoId) {
      return res.status(400).json({ 
        message: 'Faltan campos obligatorios: nombre, apellidos, idSenati, curso o encargadoId' 
      });
    }

    const encargadoRepository = AppDataSource.getRepository(Encargado);
    const encargado = await encargadoRepository.findOneBy({ id: encargadoId });

    if (!encargado) {
      return res.status(404).json({ message: 'Encargado no encontrado' });
    }

    const instructorRepository = AppDataSource.getRepository(Instructor);
    const nuevoInstructor = instructorRepository.create({
      nombre,
      apellidos,
      idSenati,
      curso,
      encargado, // Relación establecida
      fechaCreacion: new Date()
    });

    await instructorRepository.save(nuevoInstructor);

    return res.status(201).json({
      message: 'Instructor creado exitosamente',
      data: nuevoInstructor
    });

  } catch (error) {
    console.error('Error al crear instructor:', error);
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

export const getInstructores = async (req: Request, res: Response): Promise<Response> => {
  try {
    const instructorRepository = AppDataSource.getRepository(Instructor);

    const instructores = await instructorRepository.find();

    return res.json(instructores);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener instructores" });
  }
};

//////////////////autocompletar instructores
export const autocompletarInstructores = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;

    if (!query) {
      return res.status(400).json({ message: 'Se requiere una cadena de búsqueda' });
    }

    const repo = AppDataSource.getRepository(Instructor);

    const resultados = await repo
      .createQueryBuilder('instructor')
      .where('instructor.nombre ILIKE :query', { query: `${query}%` })
      .orWhere('instructor.apellidos ILIKE :query', { query: `${query}%` })
      .orWhere('CAST(instructor.idSenati AS TEXT) ILIKE :query', { query: `${query}%` })
      .orderBy('instructor.apellidos', 'ASC')
      .limit(10)
      .getMany();

    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar instructores' });
  }
};