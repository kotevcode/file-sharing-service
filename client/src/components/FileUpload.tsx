import { useState, useCallback } from 'react';
import { Card, Text, Group, Button, NumberInput, Modal } from '@mantine/core';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import styles from '../styles/app.module.scss';

interface UploadResponse {
  fileUrl: string;
}

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [expiresAt, setExpiredAt] = useState(1);
  const [shareableUrl, setShareableUrl] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('No file selected');
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.put<UploadResponse>(
        `${import.meta.env.VITE_API_URL}/v1/file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Retention-Time': expiresAt.toString(),
          },
        }
      );
      
      return response.data;
    },
    onSuccess: (data) => {
      setShareableUrl(data.fileUrl);
      setIsModalOpen(true);
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: 1,
  });

  const handleSubmit = () => {
    uploadMutation.mutate();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableUrl);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div
          {...getRootProps()}
          className={styles.dropzone}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Text>Drop the image here...</Text>
          ) : (
            <Text>Drag and drop an image here, or click to select</Text>
          )}
        </div>

        {file && (
          <Text size="sm" mt="md">
            Selected file: {file.name}
          </Text>
        )}

        <NumberInput
          label="Retention time (minutes)"
          value={expiresAt}
          onChange={(val) => setExpiredAt(Number(val) || 1)}
          min={1}
          max={3000}
          mt="md"
        />

        <Group justify="center" mt="md">
          <Button
            onClick={handleSubmit}
            loading={uploadMutation.isPending}
            disabled={!file}
          >
            Upload File
          </Button>
        </Group>
      </Card>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="File Uploaded Successfully!"
      >
        <Text>Your file is available at:</Text>
        <Text fw={500} mt="xs">{shareableUrl}</Text>
        <Button onClick={copyToClipboard} mt="md" fullWidth>
          Copy URL to Clipboard
        </Button>
      </Modal>
    </>
  );
}