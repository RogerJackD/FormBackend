import { Router } from "express";
import { createEncargado } from "../controllers/encargado.controller";

const router = Router();

router.post("/", createEncargado);

export default router;
