import { Router } from 'express';
import { createPermisoMaterial } from '../controllers/permiso-material.controller';

const router = Router();

router.post('/', createPermisoMaterial);

export default router;