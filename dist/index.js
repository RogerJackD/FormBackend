"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const encargado_routes_1 = __importDefault(require("./routes/encargado.routes"));
const instructor_routes_1 = __importDefault(require("./routes/instructor.routes"));
const permiso_instructor_routes_1 = __importDefault(require("./routes/permiso-instructor.routes"));
const permiso_material_routes_1 = __importDefault(require("./routes/permiso-material.routes"));
const permiso_aprendiz_routes_1 = __importDefault(require("./routes/permiso-aprendiz.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware para JSON
app.use(express_1.default.json());
// Inicializar conexión a base de datos
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source initialized");
    // Rutas
    app.use("/api/encargados", encargado_routes_1.default); // Ruta para encargados
    app.use("/api/instructores", instructor_routes_1.default); // Ruta para instructores (nueva)
    app.use('/api/permisos-instructores', permiso_instructor_routes_1.default);
    app.use('/api/permisos-materiales', permiso_material_routes_1.default);
    app.use('/api/permisos-aprendices', permiso_aprendiz_routes_1.default);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
