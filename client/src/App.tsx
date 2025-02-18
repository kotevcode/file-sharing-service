import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FileUpload } from './components/FileUpload';
import '@mantine/core/styles.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <div style={{ 
          maxWidth: '600px', 
          margin: '40px auto', 
          padding: '0 20px' 
        }}>
          <FileUpload />
        </div>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;