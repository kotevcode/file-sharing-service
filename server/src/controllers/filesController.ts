import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import File from '@/models/file';

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

export default class FilesController {
  // create a file
  static async create(req: Request, res: Response, next: NextFunction) {
    const { image, expiresAt } = req.body;
    
    // upload the image to s3
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    if (!process.env.AWS_S3_BUCKET) {
      throw new Error('AWS_S3_BUCKET environment variable is not set');
    }

    // Generate a unique file ID and preserve the file extension
    const fileId = uuidv4();
    const extension = path.extname(req.file.originalname);
    const fileKey = `${fileId}${extension}`;

    // Upload file to S3
    const s3Params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET as string,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    await s3.upload(s3Params).promise();

    // Save file metadata using Sequelize
    await File.create({
      id: fileId,
      s3Key: fileKey,
      expiresAt,
    });

    // Construct the shareable URL (assumes the server's host is in req.headers.host)
    const fileUrl = `http://${req.headers.host}/v1/${fileId}`;
    const responseObj = { fileUrl };
    res.status(200).json(responseObj);
  }

  // get a file
  static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const file = await File.findByPk(id);
    if (!file) {
      throw new Error('File not found');
    }
    if (file.expiresAt.getTime() < Date.now()) {
      res.status(410).json({ error: 'File expired.' });
      return;
    }
    
    // Prepare S3 parameters
    const s3Params: AWS.S3.GetObjectRequest = {
      Bucket: process.env.S3_BUCKET as string,
      Key: file.s3Key,
    };

    // Get file metadata from S3 to set headers
    s3.headObject(s3Params, (headErr, metadata) => {
      if (headErr) {
        console.error('Error retrieving metadata from S3:', headErr);
        res.status(500).json({ error: 'Error retrieving file metadata.' });
        return;
      }
      if (metadata.ContentType) {
        res.setHeader('Content-Type', metadata.ContentType);
      }
      if (metadata.ContentLength) {
        res.setHeader('Content-Length', metadata.ContentLength.toString());
      }

      // Create a readable stream from S3
      const fileStream: Readable = s3.getObject(s3Params).createReadStream();
      fileStream.on('error', (streamErr) => {
        console.error('Error streaming file from S3:', streamErr);
        res.status(500).json({ error: 'Error streaming file.' });
      });
      // Pipe the file stream directly to the response
      fileStream.pipe(res);
    });
  }
}
