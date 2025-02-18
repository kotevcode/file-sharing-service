import express from 'express';
import files from '@/routes/files';

const router = express.Router();

router.use('/', files);
// would be better like this:
// router.use('/files', files);

export default router;
