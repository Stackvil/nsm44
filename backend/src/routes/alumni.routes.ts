import { Router } from 'express';
import * as alumniController from '../controllers/alumni.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, alumniController.getAllAlumni);
router.get('/:id', authenticate, alumniController.getAlumniById);
router.put('/profile', authenticate, alumniController.updateAlumniProfile);
router.post('/:id/verify', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), alumniController.verifyAlumni);

export default router;
