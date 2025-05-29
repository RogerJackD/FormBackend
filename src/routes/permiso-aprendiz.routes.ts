import { Router } from 'express';
import { createPermisoAprendiz, getPermisosAprendices, getPermisoAprendizporID, updatePermisoAprendiz,
    softDeletePermisoAprendiz, restaurarPermisoAprendiz, deletePermisoAprendiz } from '../controllers/permiso-aprendiz.controller';

const router = Router();

router.post('/', createPermisoAprendiz);
router.get("/", getPermisosAprendices);
router.get('/:id', getPermisoAprendizporID); // Para el filtrado de formulario
router.put('/:id', updatePermisoAprendiz); // Para editar un formulario
router.patch('/anular/:id', softDeletePermisoAprendiz); // Soft delete
router.patch('/desanular/:id', restaurarPermisoAprendiz); // Revertir soft delete
router.delete('/:id', deletePermisoAprendiz); // para eliminar un formulario

export default router;