import express from 'express';
import { getContent, updateContent } from '../controllers/content.controller';
// import { protect, admin } from '../middleware/auth.middleware'; // Assuming these exist

const router = express.Router();

router.get('/:slug', getContent);
router.put('/:slug', updateContent); // Add protect/admin middleware later

export default router;
