import { NextFunction, Request, Response } from 'express';
import { FindOptions, Op } from 'sequelize';
// import File from '@/models/File';

export default class FilesController {
  // create a file
  static async create(req: Request, res: Response, next: NextFunction) {
    const { image, expiresAt } = req.body;
    /* const file = await File.create({ image });
    res.status(201).json(file); */
    res.json({ message: 'created' });
  }

  // get a file
  static async get(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    /* const file = await File.findByPk(id);
    res.status(200).json(file); */
    res.json({ message: 'success' });
  }
}
