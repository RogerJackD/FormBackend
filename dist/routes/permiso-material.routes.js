"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permiso_material_controller_1 = require("../controllers/permiso-material.controller");
const router = (0, express_1.Router)();
router.post('/', permiso_material_controller_1.createPermisoMaterial);
router.get('/', permiso_material_controller_1.getPermisosMaterial);
router.get('/:id', permiso_material_controller_1.getPermisoMaterialporID);
router.put('/:id', permiso_material_controller_1.updatePermisoMaterial);
router.patch('/anular/:id', permiso_material_controller_1.softDeletePermisoMaterial); // Soft delete
router.patch('/desanular/:id', permiso_material_controller_1.restaurarPermisoMaterial); // Revertir soft delete
router.delete('/:id', permiso_material_controller_1.deletePermisoMaterial);
exports.default = router;
