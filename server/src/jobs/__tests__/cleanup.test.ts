import cleanupExpiredFiles from '../cleanup';
import File from '@/models/file';
import AWS from 'aws-sdk';

// Mock File model
jest.mock('@/models/file', () => {
  const mockFile = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockFile,
  };
});

// Mock AWS S3
jest.mock('aws-sdk', () => {
  const mockDeleteObject = jest.fn().mockReturnValue({
    promise: jest.fn().mockResolvedValue({}),
  });
  
  return {
    S3: jest.fn(() => ({
      deleteObject: mockDeleteObject,
    })),
  };
});

describe('cleanupExpiredFiles', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should cleanup expired files', async () => {
    // Mock expired file
    const expiredFile = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      s3Key: 'expired.jpg',
      expiresAt: new Date(Date.now() - 1000),
      deleted: false,
      save: jest.fn().mockResolvedValue(true),
    };

    // Mock findAll to return our test file
    (File.findAll as jest.Mock).mockResolvedValue([expiredFile]);

    // Run cleanup
    await cleanupExpiredFiles();

    // Verify S3 deleteObject was called
    const s3Instance = new AWS.S3();
    expect(s3Instance.deleteObject).toHaveBeenCalledWith({
      Bucket: expect.any(String),
      Key: expiredFile.s3Key,
    });

    // Verify file was marked as deleted
    expect(expiredFile.deleted).toBe(true);
    expect(expiredFile.save).toHaveBeenCalled();
  });

  it('should handle S3 deletion errors gracefully', async () => {
    // Mock S3 error
    const mockS3 = new AWS.S3();
    (mockS3.deleteObject as jest.Mock).mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('S3 Error')),
    });

    // Mock expired file
    const expiredFile = {
      id: '123e4567-e89b-12d3-a456-426614174002',
      s3Key: 'error.jpg',
      expiresAt: new Date(Date.now() - 1000),
      deleted: false,
      save: jest.fn().mockResolvedValue(true),
    };

    // Mock findAll to return our test file
    (File.findAll as jest.Mock).mockResolvedValue([expiredFile]);

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Run cleanup
    await cleanupExpiredFiles();

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      `Error cleaning file ${expiredFile.id}:`,
      expect.any(Error)
    );

    // Verify file was not marked as deleted
    expect(expiredFile.deleted).toBe(false);
    expect(expiredFile.save).not.toHaveBeenCalled();

    // Restore console.error
    consoleSpy.mockRestore();
  });

  it('should handle empty results', async () => {
    // Mock findAll to return empty array
    (File.findAll as jest.Mock).mockResolvedValue([]);

    // Run cleanup
    await cleanupExpiredFiles();

    // Verify S3 deleteObject was not called
    const s3Instance = new AWS.S3();
    expect(s3Instance.deleteObject).not.toHaveBeenCalled();
  });
});