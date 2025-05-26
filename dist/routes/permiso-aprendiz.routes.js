"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permiso_aprendiz_controller_1 = require("../controllers/permiso-aprendiz.controller");
const router = (0, express_1.Router)();
router.post('/', permiso_aprendiz_controller_1.createPermisoAprendiz);
router.get("/", permiso_aprendiz_controller_1.getPermisosAprendices);
router.get('/:id', permiso_aprendiz_controller_1.getPermisoAprendizporID); // Para el filtrado de formulario
router.put('/:id', permiso_aprendiz_controller_1.updatePermisoAprendiz); // Para editar un formulario
router.delete('/:id', permiso_aprendiz_controller_1.deletePermisoAprendiz); // para eliminar un formulario
exports.default = router;
