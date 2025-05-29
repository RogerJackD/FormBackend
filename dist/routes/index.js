"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permisoAprendizRoutes = exports.permisoMaterialRoutes = exports.permisoInstructorRoutes = exports.instructorRoutes = exports.encargadoRoutes = void 0;
var encargado_routes_1 = require("./encargado.routes");
Object.defineProperty(exports, "encargadoRoutes", { enumerable: true, get: function () { return __importDefault(encargado_routes_1).default; } });
var instructor_routes_1 = require("./instructor.routes");
Object.defineProperty(exports, "instructorRoutes", { enumerable: true, get: function () { return __importDefault(instructor_routes_1).default; } });
var permiso_instructor_routes_1 = require("./permiso-instructor.routes");
Object.defineProperty(exports, "permisoInstructorRoutes", { enumerable: true, get: function () { return __importDefault(permiso_instructor_routes_1).default; } });
var permiso_material_routes_1 = require("./permiso-material.routes");
Object.defineProperty(exports, "permisoMaterialRoutes", { enumerable: true, get: function () { return __importDefault(permiso_material_routes_1).default; } });
var permiso_aprendiz_routes_1 = require("./permiso-aprendiz.routes");
Object.defineProperty(exports, "permisoAprendizRoutes", { enumerable: true, get: function () { return __importDefault(permiso_aprendiz_routes_1).default; } });
