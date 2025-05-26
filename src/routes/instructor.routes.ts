import { Router } from 'express';
import { createInstructor, getInstructores, autocompletarInstructores } from '../controllers/instructor.controller';

const router = Router();

router.post('/', createInstructor);
router.get('/', getInstructores);
router.get('/autocompletar', autocompletarInstructores)
export default router;