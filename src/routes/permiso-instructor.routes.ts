import { Router } from 'express';
import { createPermisoInstructor, getPermisosInstructores, getPermisoInstructorporID, updatePermisoInstructor,
    softDeletePermisoInstructor, restaurarPermisoInstructor, deletePermisoInstructor } from '../controllers/permiso-instructor.controller';

const router = Router();

router.post('/', createPermisoInstructor);
router.get('/', getPermisosInstructores);
router.get('/:id', getPermisoInstructorporID);
router.put('/:id', updatePermisoInstructor);
router.patch('/anular/:id', softDeletePermisoInstructor); // Soft delete
router.patch('/desanular/:id', restaurarPermisoInstructor); // Revertir soft delete
router.delete('/:id', deletePermisoInstructor);

export default router;