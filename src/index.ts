    import express from "express";
    import encargadoRoutes from "./routes/encargado.routes";
    import { AppDataSource } from "./config/database";

    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware para JSON
    app.use(express.json());

    // Inicializar conexión a base de datos
    AppDataSource.initialize()
    .then(() => {
        console.log("Data Source initialized");

        // Rutas
        app.use("/api", encargadoRoutes);

        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });
