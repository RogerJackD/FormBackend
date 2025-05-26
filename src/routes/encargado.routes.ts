import { Router } from "express";
import { createEncargado, verificarEncargado } from "../controllers/encargado.controller";

const router = Router();

// Crear encargado
router.post("/", createEncargado);

// Verificar encargado
router.post("/login", verificarEncargado);

export default router;
