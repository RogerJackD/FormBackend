"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermisoInstructor = exports.updatePermisoInstructor = exports.getPermisoInstructorporID = exports.getPermisosInstructores = exports.createPermisoInstructor = void 0;
const database_1 = require("../config/database");
const permiso_instructor_entity_1 = require("../entities/permiso-instructor.entity");
const instructor_entity_1 = require("../entities/instructor.entity");
const encargado_entity_1 = require("../entities/encargado.entity");
const typeorm_1 = require("typeorm");
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
//Obtener los registros de permiso de intructores
const getPermisosInstructores = async (req, res) => {
    try {
        const { id_senati, apellidos, fecha } = req.query;
        const repo = database_1.AppDataSource.getRepository(permiso_instructor_entity_1.PermisoInstructor);
        const where = {};
        if (id_senati) {
            where.instructor = {
                idSenati: Number(id_senati)
            };
        }
        if (apellidos) {
            where.apellidos = (0, typeorm_1.ILike)(`%${apellidos}%`);
        }
        if (fecha) {
            const [year, month, day] = fecha.split("-").map(Number);
            const inicio = new Date(year, month - 1, day, 0, 0, 0, 0);
            const fin = new Date(year, month - 1, day, 23, 59, 59, 999);
            where.fechaCreacion = (0, typeorm_1.Between)(inicio, fin);
        }
        const permisos = await repo.find({
            where,
            relations: ['instructor', 'encargado'],
            order: { fechaCreacion: "DESC" },
        });
        return res.json(permisos);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener permisos de instructores" });
    }
};
exports.getPermisosInstructores = getPermisosInstructores;
// Obtener permiso por ID
const getPermisoInstructorporID = async (req, res) => {
    const { id } = req.params;
    try {
        const repo = database_1.AppDataSource.getRepository(permiso_instructor_entity_1.PermisoInstructor);
        const permiso = await repo.findOne({
            where: { id: Number(id) },
            relations: ['instructor', 'encargado'] // si quieres info relacionada
        });
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }
        return res.json(permiso);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener permiso' });
    }
};
exports.getPermisoInstructorporID = getPermisoInstructorporID;
// Actualizar permiso por ID
const updatePermisoInstructor = async (req, res) => {
    const { id } = req.params;
    const { apellidos, dependencia, cargo, hora_salida, hora_regreso, motivo, detalle_motivo, encargadoId } = req.body;
    try {
        const repo = database_1.AppDataSource.getRepository(permiso_instructor_entity_1.PermisoInstructor);
        const permiso = await repo.findOneBy({ id: Number(id) });
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }
        // Actualizar campos (sin instructor, si quieres actualizar instructor tendrías que buscar el instructor también)
        permiso.apellidos = apellidos ?? permiso.apellidos;
        permiso.dependencia = dependencia ?? permiso.dependencia;
        permiso.cargo = cargo ?? permiso.cargo;
        permiso.hora_salida = hora_salida ?? permiso.hora_salida;
        permiso.hora_regreso = hora_regreso ?? permiso.hora_regreso;
        permiso.motivo = motivo ?? permiso.motivo;
        permiso.detalle_motivo = detalle_motivo ?? permiso.detalle_motivo;
        if (encargadoId) {
            const encargadoRepo = database_1.AppDataSource.getRepository(encargado_entity_1.Encargado);
            const encargado = await encargadoRepo.findOneBy({ id: encargadoId });
            if (!encargado) {
                return res.status(404).json({ message: 'Encargado no encontrado' });
            }
            permiso.encargado = encargado;
        }
        await repo.save(permiso);
        return res.json({ message: 'Permiso actualizado', data: permiso });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar permiso' });
    }
};
exports.updatePermisoInstructor = updatePermisoInstructor;
// Eliminar permiso por ID
const deletePermisoInstructor = async (req, res) => {
    const { id } = req.params;
    try {
        const repo = database_1.AppDataSource.getRepository(permiso_instructor_entity_1.PermisoInstructor);
        const permiso = await repo.findOneBy({ id: Number(id) });
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }
        await repo.remove(permiso);
        return res.json({ message: 'Permiso eliminado' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar permiso' });
    }
};
exports.deletePermisoInstructor = deletePermisoInstructor;
