import { Router } from 'express';
import { createInstructor } from '../controllers/instructor.controller';

const router = Router();

router.post('/', createInstructor);

export default router;