import { Router } from 'express';
import { createPermisoAprendiz, getPermisosAprendices, getPermisoAprendizporID, updatePermisoAprendiz, deletePermisoAprendiz } from '../controllers/permiso-aprendiz.controller';

const router = Router();

router.post('/', createPermisoAprendiz);
router.get("/", getPermisosAprendices);
router.get('/:id', getPermisoAprendizporID); // Para el filtrado de formulario
router.put('/:id', updatePermisoAprendiz); // Para editar un formulario
router.delete('/:id', deletePermisoAprendiz); // para eliminar un formulario

export default router;