"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const instructor_controller_1 = require("../controllers/instructor.controller");
const router = (0, express_1.Router)();
router.post('/', instructor_controller_1.createInstructor);
router.get('/', instructor_controller_1.getInstructores);
router.get('/autocompletar', instructor_controller_1.autocompletarInstructores);
exports.default = router;
