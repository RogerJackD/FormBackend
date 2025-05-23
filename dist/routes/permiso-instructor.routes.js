"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permiso_instructor_controller_1 = require("../controllers/permiso-instructor.controller");
const router = (0, express_1.Router)();
router.post('/', permiso_instructor_controller_1.createPermisoInstructor);
exports.default = router;
