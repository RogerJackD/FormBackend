import { Router } from 'express';
import { createPermisoInstructor } from '../controllers/permiso-instructor.controller';

const router = Router();

router.post('/', createPermisoInstructor);

export default router;