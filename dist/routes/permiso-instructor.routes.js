"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permiso_instructor_controller_1 = require("../controllers/permiso-instructor.controller");
const router = (0, express_1.Router)();
router.post('/', permiso_instructor_controller_1.createPermisoInstructor);
router.get('/', permiso_instructor_controller_1.getPermisosInstructores);
router.get('/:id', permiso_instructor_controller_1.getPermisoInstructorporID);
router.put('/:id', permiso_instructor_controller_1.updatePermisoInstructor);
router.patch('/anular/:id', permiso_instructor_controller_1.softDeletePermisoInstructor); // Soft delete
router.patch('/desanular/:id', permiso_instructor_controller_1.restaurarPermisoInstructor); // Revertir soft delete
router.delete('/:id', permiso_instructor_controller_1.deletePermisoInstructor);
exports.default = router;
