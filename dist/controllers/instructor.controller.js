"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstructor = void 0;
const database_1 = require("../config/database");
const instructor_entity_1 = require("../entities/instructor.entity");
const encargado_entity_1 = require("../entities/encargado.entity");
const createInstructor = async (req, res) => {
    try {
        const { nombre, apellidos, idSenati, curso, encargadoId } = req.body;
        // Validación básica
        if (!nombre || !apellidos || !idSenati || !curso || !encargadoId) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios: nombre, apellidos, idSenati, curso o encargadoId'
            });
        }
        const encargadoRepository = database_1.AppDataSource.getRepository(encargado_entity_1.Encargado);
        const encargado = await encargadoRepository.findOneBy({ id: encargadoId });
        if (!encargado) {
            return res.status(404).json({ message: 'Encargado no encontrado' });
        }
        const instructorRepository = database_1.AppDataSource.getRepository(instructor_entity_1.Instructor);
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
    }
    catch (error) {
        console.error('Error al crear instructor:', error);
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.createInstructor = createInstructor;
