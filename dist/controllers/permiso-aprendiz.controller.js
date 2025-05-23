"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermisoAprendiz = void 0;
const database_1 = require("../config/database");
const permiso_aprendiz_entity_1 = require("../entities/permiso-aprendiz.entity");
const encargado_entity_1 = require("../entities/encargado.entity");
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
