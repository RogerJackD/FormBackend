import { Router } from 'express';
import { createPermisoInstructor, getPermisosInstructores, getPermisoInstructorporID, updatePermisoInstructor, deletePermisoInstructor } from '../controllers/permiso-instructor.controller';

const router = Router();

router.post('/', createPermisoInstructor);
router.get('/', getPermisosInstructores);
router.get('/:id', getPermisoInstructorporID);
router.put('/:id', updatePermisoInstructor);
router.delete('/:id', deletePermisoInstructor);

export default router;