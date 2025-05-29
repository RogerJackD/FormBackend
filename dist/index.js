"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_middleware_1 = __importDefault(require("./middlewares/cors.middleware"));
const database_1 = require("./config/database");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware para CORS
app.use(cors_middleware_1.default);
// Middleware default
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express_1.default.json());
// Inicializar conexión a base de datos
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source initialized");
    // Rutas
    app.use("/api/encargados", routes_1.encargadoRoutes);
    app.use("/api/instructores", routes_1.instructorRoutes);
    app.use('/api/permisos-instructores', routes_1.permisoInstructorRoutes);
    app.use('/api/permisos-materiales', routes_1.permisoMaterialRoutes);
    app.use('/api/permisos-aprendices', routes_1.permisoAprendizRoutes);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
