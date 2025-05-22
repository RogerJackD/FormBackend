import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Instructor } from '../entities/instructor.entity';
import { Encargado } from '../entities/encargado.entity';

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