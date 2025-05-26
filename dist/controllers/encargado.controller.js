"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarEncargado = exports.createEncargado = void 0;
const database_1 = require("../config/database");
const encargado_entity_1 = require("../entities/encargado.entity");
const createEncargado = async (req, res) => {
    try {
        const { nombres, apellidos, usuario, contrasena } = req.body;
        // Validar que recibimos todos los datos
        if (!nombres || !apellidos || !usuario || !contrasena) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }
        const encargadoRepository = database_1.AppDataSource.getRepository(encargado_entity_1.Encargado);
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear encargado" });
    }
};
exports.createEncargado = createEncargado;
const verificarEncargado = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        if (!usuario || !contrasena) {
            return res.status(400).json({ message: "Usuario y contraseña son obligatorios", accesso: false });
        }
        const encargadoRepository = database_1.AppDataSource.getRepository(encargado_entity_1.Encargado);
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
    }
    catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};
exports.verificarEncargado = verificarEncargado;
