import express from "express";
import cors from "cors";
import corsMiddleware from './middlewares/cors.middleware';
import { AppDataSource } from "./config/database";
import { 
  encargadoRoutes, 
  instructorRoutes, 
  permisoInstructorRoutes, 
  permisoMaterialRoutes, 
  permisoAprendizRoutes 
} from './routes'; 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para CORS
app.use(corsMiddleware);

// Middleware default
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Inicializar conexión a base de datos
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized");

    // Rutas
    app.use("/api/encargados", encargadoRoutes);
    app.use("/api/instructores", instructorRoutes);
    app.use('/api/permisos-instructores', permisoInstructorRoutes);
    app.use('/api/permisos-materiales', permisoMaterialRoutes);
    app.use('/api/permisos-aprendices', permisoAprendizRoutes); 

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
