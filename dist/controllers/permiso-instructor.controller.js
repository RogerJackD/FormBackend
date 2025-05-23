"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermisoInstructor = void 0;
const database_1 = require("../config/database");
const permiso_instructor_entity_1 = require("../entities/permiso-instructor.entity");
const instructor_entity_1 = require("../entities/instructor.entity");
const encargado_entity_1 = require("../entities/encargado.entity");
const createPermisoInstructor = async (req, res) => {
    try {
        const { idSenati, apellidos, dependencia, cargo, hora_salida, hora_regreso, motivo, detalle_motivo, encargadoId } = req.body;
        // Validación básica
        if (!idSenati || !apellidos || !dependencia || !cargo || !hora_salida || !hora_regreso || !motivo || !encargadoId) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios'
            });
        }
        const instructorRepository = database_1.AppDataSource.getRepository(instructor_entity_1.Instructor);
        const instructor = await instructorRepository.findOneBy({ idSenati });
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor no encontrado' });
        }
        const encargadoRepository = database_1.AppDataSource.getRepository(encargado_entity_1.Encargado);
        const encargado = await encargadoRepository.findOneBy({ id: encargadoId });
        if (!encargado) {
            return res.status(404).json({ message: 'Encargado no encontrado' });
        }
        ////normalizar hora
        const normalizeTime = (timeString) => {
            if (!timeString.includes(':')) {
                throw new Error(`Formato de hora inválido: ${timeString}`);
            }
            return timeString.includes(':') && timeString.split(':').length === 2
                ? `${timeString}:00` // Agrega segundos si faltan
                : timeString;
        };
        const permisoRepository = database_1.AppDataSource.getRepository(permiso_instructor_entity_1.PermisoInstructor);
        const nuevoPermiso = permisoRepository.create({
            instructor,
            apellidos,
            dependencia,
            cargo,
            hora_salida: normalizeTime(hora_salida),
            hora_regreso: normalizeTime(hora_regreso),
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
    }
    catch (error) {
        console.error('Error al crear permiso:', error);
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.createPermisoInstructor = createPermisoInstructor;
