"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEncargado = void 0;
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
