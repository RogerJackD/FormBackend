import { Router } from 'express';
import { createPermisoAprendiz } from '../controllers/permiso-aprendiz.controller';

const router = Router();

router.post('/', createPermisoAprendiz);

export default router;