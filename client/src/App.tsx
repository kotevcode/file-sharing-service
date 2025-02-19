import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FileUpload } from './components/FileUpload';
import '@mantine/core/styles.css';
import styles from './styles/app.module.scss';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <div className={styles.container}>
          <FileUpload />
        </div>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;