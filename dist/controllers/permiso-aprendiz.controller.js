"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermisoAprendiz = exports.restaurarPermisoAprendiz = exports.softDeletePermisoAprendiz = exports.updatePermisoAprendiz = exports.getPermisoAprendizporID = exports.getPermisosAprendices = exports.createPermisoAprendiz = void 0;
const database_1 = require("../config/database");
const permiso_aprendiz_entity_1 = require("../entities/permiso-aprendiz.entity");
const encargado_entity_1 = require("../entities/encargado.entity");
const typeorm_1 = require("typeorm");
const formatFecha_1 = require("../utils/formatFecha");
const createPermisoAprendiz = async (req, res) => {
    try {
        const { nombres, apellidos, ocupacion, grupo, programa, motivo, hora_salida, hora_retorno, tiempo_permiso, encargadoId } = req.body;
        // Validación de campos obligatorios
        if (!nombres || !apellidos || !ocupacion || !grupo || !programa || !motivo ||
            !hora_salida || !hora_retorno || !tiempo_permiso || !encargadoId) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }
        // Validación de formato de hora (HH:MM o HH:MM:SS)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
        if (!timeRegex.test(hora_salida) || !timeRegex.test(hora_retorno)) {
            return res.status(400).json({
                message: 'Formato de hora inválido. Use HH:MM o HH:MM:SS'
            });
        }
        const encargadoRepository = database_1.AppDataSource.getRepository(encargado_entity_1.Encargado);
        const encargado = await encargadoRepository.findOneBy({ id: encargadoId });
        if (!encargado) {
            return res.status(404).json({ message: 'Encargado no encontrado' });
        }
        const permisoRepository = database_1.AppDataSource.getRepository(permiso_aprendiz_entity_1.PermisoAprendiz);
        const nuevoPermiso = permisoRepository.create({
            nombres,
            apellidos,
            ocupacion,
            grupo,
            programa,
            motivo,
            hora_salida: hora_salida.includes(':') ? hora_salida : `${hora_salida}:00`, // Normaliza
            hora_retorno: hora_retorno.includes(':') ? hora_retorno : `${hora_retorno}:00`,
            tiempo_permiso,
            encargado,
            fechaCreacion: new Date()
        });
        await permisoRepository.save(nuevoPermiso);
        return res.status(201).json({
            message: 'Permiso de aprendiz creado exitosamente',
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
exports.createPermisoAprendiz = createPermisoAprendiz;
/////////////////////////////////////////////////////////////////////metodo get
const getPermisosAprendices = async (req, res) => {
    try {
        const { id, nombre, fecha, anulado } = req.query;
        const repo = database_1.AppDataSource.getRepository(permiso_aprendiz_entity_1.PermisoAprendiz);
        const where = {};
        if (id) {
            where.id = Number(id);
        }
        if (nombre) {
            where.nombres = (0, typeorm_1.ILike)(`%${nombre}%`);
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
            order: { fechaCreacion: "DESC" },
        });
        const permisosFormateados = permisos.map(p => ({
            ...p,
            fechaCreacion: (0, formatFecha_1.formatearFecha)(p.fechaCreacion)
        }));
        return res.json(permisosFormateados);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al filtrar permisos de aprendices" });
    }
};
exports.getPermisosAprendices = getPermisosAprendices;
// Filtrar Formulario por ID
const getPermisoAprendizporID = async (req, res) => {
    const id = Number(req.params.id);
    // Verifica que sea un número válido
    if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }
    const repo = database_1.AppDataSource.getRepository(permiso_aprendiz_entity_1.PermisoAprendiz);
    const permiso = await repo.findOne({ where: { id } });
    if (!permiso) {
        return res.status(404).json({ message: "Permiso no encontrado" });
    }
    return res.json({
        ...permiso,
        fechaCreacion: (0, formatFecha_1.formatearFecha)(permiso.fechaCreacion)
    });
};
exports.getPermisoAprendizporID = getPermisoAprendizporID;
// Editar un formulario
const updatePermisoAprendiz = async (req, res) => {
    const id = Number(req.params.id);
    const repo = database_1.AppDataSource.getRepository(permiso_aprendiz_entity_1.PermisoAprendiz);
    let permiso = await repo.findOneBy({ id });
    if (!permiso) {
        return res.status(404).json({ message: "Permiso no encontrado" });
    }
    // Actualizar campos permitidos
    repo.merge(permiso, req.body);
    try {
        const result = await repo.save(permiso);
        return res.json({
            message: "Permiso actualizado correctamente",
            data: result
        });
    }
    catch (error) {
        console.error("Error al actualizar:", error);
        return res.status(500).json({ message: "Error al actualizar permiso" });
    }
};
exports.updatePermisoAprendiz = updatePermisoAprendiz;
// Soft delete con PATCH
const softDeletePermisoAprendiz = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = database_1.AppDataSource.getRepository(permiso_aprendiz_entity_1.PermisoAprendiz);
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
exports.softDeletePermisoAprendiz = softDeletePermisoAprendiz;
// Restaurar un soft delete con PATCH
const restaurarPermisoAprendiz = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = database_1.AppDataSource.getRepository(permiso_aprendiz_entity_1.PermisoAprendiz);
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
exports.restaurarPermisoAprendiz = restaurarPermisoAprendiz;
// Eliminar un formulario
const deletePermisoAprendiz = async (req, res) => {
    const id = Number(req.params.id);
    const repo = database_1.AppDataSource.getRepository(permiso_aprendiz_entity_1.PermisoAprendiz);
    const result = await repo.delete(id);
    if (result.affected === 0) {
        return res.status(404).json({ message: "Permiso no encontrado" });
    }
    return res.json({ message: "Permiso eliminado correctamente" });
};
exports.deletePermisoAprendiz = deletePermisoAprendiz;
