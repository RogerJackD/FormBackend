"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermisoMaterial = void 0;
const database_1 = require("../config/database");
const permiso_material_entity_1 = require("../entities/permiso-material.entity");
const instructor_entity_1 = require("../entities/instructor.entity");
const encargado_entity_1 = require("../entities/encargado.entity");
const createPermisoMaterial = async (req, res) => {
    try {
        const { nombre_aprendiz, accion, detalle_accion, id_senati, // Campo opcional
        nombre_señor, encargadoId // Campo obligatorio
         } = req.body;
        // Validación de campos obligatorios
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
        // Validación opcional: Si se envía id_senati, debe existir en Instructores
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
            instructor: instructor || undefined, // Puede ser null
            nombre_señor,
            encargado, // Obligatorio
            fechaCreacion: new Date()
        });
        await permisoRepository.save(nuevoPermiso);
        return res.status(201).json({
            message: 'Permiso de materiales creado exitosamente',
            data: nuevoPermiso
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
