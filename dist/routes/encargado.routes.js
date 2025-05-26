"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const encargado_controller_1 = require("../controllers/encargado.controller");
const router = (0, express_1.Router)();
// Crear encargado
router.post("/", encargado_controller_1.createEncargado);
// Verificar encargado
router.post("/login", encargado_controller_1.verificarEncargado);
exports.default = router;
