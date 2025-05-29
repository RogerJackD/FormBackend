import { Router } from 'express';
import { createPermisoMaterial, getPermisosMaterial, getPermisoMaterialporID, updatePermisoMaterial, softDeletePermisoMaterial, restaurarPermisoMaterial, deletePermisoMaterial} from '../controllers/permiso-material.controller';

const router = Router();

router.post('/', createPermisoMaterial);
router.get('/', getPermisosMaterial);
router.get('/:id', getPermisoMaterialporID);
router.put('/:id', updatePermisoMaterial);
router.patch('/anular/:id', softDeletePermisoMaterial); // Soft delete
router.patch('/desanular/:id', restaurarPermisoMaterial); // Revertir soft delete
router.delete('/:id', deletePermisoMaterial);

export default router;