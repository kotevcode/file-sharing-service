import { Request, Response, NextFunction } from 'express';
import CustomError from '@/libs/errors/customError';

const validateImageFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new CustomError('No file uploaded', 400);
  }

  if (!req.file.mimetype.startsWith('image/')) {
    throw new CustomError('File must be an image', 400);
  }

  next();
};

export default validateImageFile; 