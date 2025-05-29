"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermisoMaterial = exports.restaurarPermisoMaterial = exports.softDeletePermisoMaterial = exports.updatePermisoMaterial = exports.getPermisoMaterialporID = exports.getPermisosMaterial = exports.createPermisoMaterial = void 0;
const database_1 = require("../config/database");
const permiso_material_entity_1 = require("../entities/permiso-material.entity");
const instructor_entity_1 = require("../entities/instructor.entity");
const encargado_entity_1 = require("../entities/encargado.entity");
const typeorm_1 = require("typeorm");
const formatFecha_1 = require("../utils/formatFecha");
// Crear permiso
const createPermisoMaterial = async (req, res) => {
    try {
        const { nombre_aprendiz, accion, detalle_accion, id_senati, nombre_señor, encargadoId } = req.body;
        if (!accion || !encargadoId) {
            return res.status(400).json({
                message: 'Faltan campos obligatorios: accion, encargadoId'
            });
        }
        const encargadoRepository = database_1.AppDataSource.getRepository(encargado_entity_1.Encargado);
        const encargado = await encargadoRepository.findOneBy({ id: encargadoId });
        if (!encargado) {
            return res.status(404).json({ message: 'Encargado no encontrado' });
        }
        let instructor = null;
        if (id_senati) {
            const instructorRepository = database_1.AppDataSource.getRepository(instructor_entity_1.Instructor);
            instructor = await instructorRepository.findOneBy({ idSenati: id_senati });
            if (!instructor) {
                return res.status(404).json({ message: 'Instructor no encontrado con el id_senati proporcionado' });
            }
        }
        const permisoRepository = database_1.AppDataSource.getRepository(permiso_material_entity_1.PermisoMaterial);
        const nuevoPermiso = permisoRepository.create({
            nombre_aprendiz,
            accion,
            detalle_accion: detalle_accion || null,
            instructor: instructor || undefined,
            nombre_señor,
            encargado,
            fechaCreacion: new Date()
        });
        await permisoRepository.save(nuevoPermiso);
        return res.status(201).json({
            message: 'Permiso de materiales creado exitosamente',
            data: {
                ...nuevoPermiso,
                fechaCreacion: (0, formatFecha_1.formatearFecha)(nuevoPermiso.fechaCreacion)
            }
        });
    }
    catch (error) {
        console.error('Error al crear permiso de materiales:', error);
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.createPermisoMaterial = createPermisoMaterial;
// Obtener todos los permisos (con filtros)
const getPermisosMaterial = async (req, res) => {
    try {
        const { id, nombre_aprendiz, nombre_señor, accion, id_senati, fecha, anulado } = req.query;
        const repo = database_1.AppDataSource.getRepository(permiso_material_entity_1.PermisoMaterial);
        const where = {};
        if (id)
            where.id = Number(id);
        if (nombre_aprendiz)
            where.nombre_aprendiz = (0, typeorm_1.ILike)(`%${nombre_aprendiz}%`);
        if (nombre_señor)
            where.nombre_señor = (0, typeorm_1.ILike)(`%${nombre_señor}%`);
        if (accion)
            where.accion = (0, typeorm_1.ILike)(`%${accion}%`);
        if (id_senati) {
            where.instructor = { idSenati: Number(id_senati) };
        }
        if (fecha) {
            const [year, month, day] = fecha.split("-").map(Number);
            const inicio = new Date(year, month - 1, day, 0, 0, 0, 0);
            const fin = new Date(year, month - 1, day, 23, 59, 59, 999);
            where.fechaCreacion = (0, typeorm_1.Between)(inicio, fin);
        }
        // Por defecto muestra permisos no anulados, query ?anulado='true' para ver solo los permisos anulados
        if (anulado === 'true') {
            where.anulado = true;
        }
        else {
            where.anulado = false;
        }
        const permisos = await repo.find({
            where,
            relations: ['instructor', 'encargado'],
            order: { fechaCreacion: "DESC" }
        });
        const permisosFormateados = permisos.map(p => ({
            ...p,
            fechaCreacion: (0, formatFecha_1.formatearFecha)(p.fechaCreacion)
        }));
        return res.json(permisosFormateados);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener permisos de materiales" });
    }
};
exports.getPermisosMaterial = getPermisosMaterial;
// Obtener uno por ID
const getPermisoMaterialporID = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = database_1.AppDataSource.getRepository(permiso_material_entity_1.PermisoMaterial);
        const permiso = await repo.findOne({
            where: { id },
            relations: ['instructor', 'encargado']
        });
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }
        return res.json({
            ...permiso,
            fechaCreacion: (0, formatFecha_1.formatearFecha)(permiso.fechaCreacion)
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al obtener permiso' });
    }
};
exports.getPermisoMaterialporID = getPermisoMaterialporID;
// Actualizar permiso
const updatePermisoMaterial = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = database_1.AppDataSource.getRepository(permiso_material_entity_1.PermisoMaterial);
        const permiso = await repo.findOne({ where: { id } });
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }
        const { nombre_aprendiz, accion, detalle_accion, id_senati, nombre_señor, encargadoId } = req.body;
        if (nombre_aprendiz !== undefined)
            permiso.nombre_aprendiz = nombre_aprendiz;
        if (accion !== undefined)
            permiso.accion = accion;
        if (detalle_accion !== undefined)
            permiso.detalle_accion = detalle_accion;
        if (nombre_señor !== undefined)
            permiso.nombre_señor = nombre_señor;
        if (id_senati) {
            const instructorRepo = database_1.AppDataSource.getRepository(instructor_entity_1.Instructor);
            const instructor = await instructorRepo.findOneBy({ idSenati: id_senati });
            if (!instructor)
                return res.status(404).json({ message: 'Instructor no encontrado' });
            permiso.instructor = instructor;
        }
        if (encargadoId) {
            const encargadoRepo = database_1.AppDataSource.getRepository(encargado_entity_1.Encargado);
            const encargado = await encargadoRepo.findOneBy({ id: encargadoId });
            if (!encargado)
                return res.status(404).json({ message: 'Encargado no encontrado' });
            permiso.encargado = encargado;
        }
        await repo.save(permiso);
        return res.json({
            message: 'Permiso actualizado',
            data: {
                ...permiso,
                fechaCreacion: (0, formatFecha_1.formatearFecha)(permiso.fechaCreacion)
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al actualizar permiso' });
    }
};
exports.updatePermisoMaterial = updatePermisoMaterial;
// Soft delete con PATCH
const softDeletePermisoMaterial = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = database_1.AppDataSource.getRepository(permiso_material_entity_1.PermisoMaterial);
        const permiso = await repo.findOne({ where: { id } });
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }
        permiso.anulado = true;
        await repo.save(permiso);
        return res.json({ message: 'Permiso marcado como anulado' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al marcar como eliminado' });
    }
};
exports.softDeletePermisoMaterial = softDeletePermisoMaterial;
// Restaurar un soft delete con PATCH
const restaurarPermisoMaterial = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = database_1.AppDataSource.getRepository(permiso_material_entity_1.PermisoMaterial);
        const permiso = await repo.findOne({ where: { id } });
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }
        permiso.anulado = false;
        await repo.save(permiso);
        return res.json({ message: 'Permiso restaurado exitosamente' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al revertir el anulado' });
    }
};
exports.restaurarPermisoMaterial = restaurarPermisoMaterial;
// Eliminar permiso
const deletePermisoMaterial = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = database_1.AppDataSource.getRepository(permiso_material_entity_1.PermisoMaterial);
        const permiso = await repo.findOne({ where: { id } });
        if (!permiso) {
            return res.status(404).json({ message: 'Permiso no encontrado' });
        }
        await repo.remove(permiso);
        return res.json({ message: 'Permiso eliminado' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al eliminar permiso' });
    }
};
exports.deletePermisoMaterial = deletePermisoMaterial;
