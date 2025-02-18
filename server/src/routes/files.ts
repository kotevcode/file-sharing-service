import express from 'express';
import multer from 'multer';
import validateRequest from '@/requests/validateRequest';
import FilesController from '@/controllers/filesController';
import filesGetReqSchema from '@/requests/files/get.schema';
import filesPutReqSchema from '@/requests/files/put.schema';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route('/file')
  .put(upload.single('image'), [
    validateRequest(filesPutReqSchema),
    FilesController.create,
  ]);

router.route('/:id')
  .get(
    validateRequest(filesGetReqSchema),
    FilesController.get
  );


export default router;
