import { Router } from 'express';
import { createPermisoMaterial, getPermisosMaterial, getPermisoMaterialporID, updatePermisoMaterial, deletePermisoMaterial} from '../controllers/permiso-material.controller';

const router = Router();

router.post('/', createPermisoMaterial);
router.get('/', getPermisosMaterial);
router.get('/:id', getPermisoMaterialporID);
router.put('/:id', updatePermisoMaterial);
router.delete('/:id', deletePermisoMaterial);

export default router;