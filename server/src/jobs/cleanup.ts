import dotenv from 'dotenv';
dotenv.config();
import AWS from 'aws-sdk';
import { Op } from 'sequelize';
import { sequelize } from '@/models';
import File from '@/models/file';
import awsConfig from '@/configs/aws';

const s3 = new AWS.S3({ region: awsConfig.region as string });

/**
 * Cleanup expired files:
 * - Query for files where expiresAt is in the past and that are not already marked as deleted.
 * - For each expired file, delete the file from S3, then mark the file as deleted in the database.
 */
export async function cleanupExpiredFiles(): Promise<void> {
  await sequelize.authenticate();
  
  const now = new Date();
  const expiredFiles = await File.findAll({
    where: { 
      expiresAt: { [Op.lt]: now },
      deleted: false
    },
  });

  for (const file of expiredFiles) {
    try {
      await s3
        .deleteObject({
          Bucket: awsConfig.s3Bucket as string,
          Key: file.s3Key,
        })
        .promise();
      // Instead of destroying the record, mark it as deleted.
      file.deleted = true;
      await file.save();
      console.log(`Marked file as deleted: ${file.id}`);
    } catch (error) {
      console.error(`Error cleaning file ${file.id}:`, error);
    }
  }
}

(async () => {
  try {
    await cleanupExpiredFiles();
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
})();
