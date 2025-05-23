"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permiso_aprendiz_controller_1 = require("../controllers/permiso-aprendiz.controller");
const router = (0, express_1.Router)();
router.post('/', permiso_aprendiz_controller_1.createPermisoAprendiz);
exports.default = router;
