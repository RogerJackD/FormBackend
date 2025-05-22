import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Encargado } from "../entities/encargado.entity";

export const createEncargado = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nombres, apellidos, usuario, contrasena } = req.body;

    // Validar que recibimos todos los datos
    if (!nombres || !apellidos || !usuario || !contrasena) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const encargadoRepository = AppDataSource.getRepository(Encargado);

    // Crear nuevo objeto Encargado
    const nuevoEncargado = encargadoRepository.create({
      nombres,
      apellidos,
      usuario,
      contrasena,
      fechaCreacion: new Date(),
    });

    // Guardar en la base de datos
    await encargadoRepository.save(nuevoEncargado);

    return res.status(201).json(nuevoEncargado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear encargado" });
  }
};
