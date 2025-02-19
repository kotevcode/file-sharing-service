import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from '@/models';

async function setupJob(): Promise<void> {
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
}

async function teardownJob(): Promise<void> {
    await sequelize.close();
    console.log('Database connection closed successfully.');
}

export async function runJob(job: () => Promise<void>): Promise<void> {
  try {
    await setupJob();
    await job();
    await teardownJob();
    process.exit(0);
  } catch (error) {
    console.error('Error during job execution:', error);
    process.exit(1);
  }
}

// Allow running from command line with dynamic job import
if (require.main === module) {
  const jobName = process.argv[2];
  if (!jobName) {
    console.error('Please specify a job name to run');
    process.exit(1);
  }

  // Import from the jobs directory
  import(`./${jobName}`)
    .then(job => runJob(job.default || job))
    .catch(error => {
      console.error('Failed to load job:', error);
      process.exit(1);
    });
}