"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permiso_material_controller_1 = require("../controllers/permiso-material.controller");
const router = (0, express_1.Router)();
router.post('/', permiso_material_controller_1.createPermisoMaterial);
exports.default = router;
