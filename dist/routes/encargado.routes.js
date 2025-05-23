"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const encargado_controller_1 = require("../controllers/encargado.controller");
const router = (0, express_1.Router)();
router.post("/", encargado_controller_1.createEncargado);
exports.default = router;
