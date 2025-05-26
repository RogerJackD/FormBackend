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

export const verificarEncargado = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
      return res.status(400).json({ message: "Usuario y contraseña son obligatorios", accesso: false });
    }

    const encargadoRepository = AppDataSource.getRepository(Encargado);

    // Buscar al encargado por su nombre de usuario
    const encargado = await encargadoRepository.findOneBy({ usuario });

    if (!encargado) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos", accesso: false });
    }

    // Comparar contraseñas
    if (encargado.contrasena !== contrasena) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos", accesso: false });
    }

    // Login exitoso, devolver id y nombre del encargado
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      accesso: true,
      id: encargado.id,
      nombres: encargado.nombres,
      apellidos: encargado.apellidos,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
