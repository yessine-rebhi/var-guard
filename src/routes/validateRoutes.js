import express from 'express';
import validateEnvController from '../controllers/validateController.js';
import auditChanges from '../controllers/auditController.js';

const router = express.Router();

router.post('/validate', validateEnvController);
router.post('/audit', auditChanges);

export default router;