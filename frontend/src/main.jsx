import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App.jsx';
import './assets/styles/index.css';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        margin: '25px',
      }}
      toastOptions={{
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        style: {
          fontSize: '14px',
          maxWidth: '420px',
          padding: '14px 18px',
          background: 'var(--toast-bg, #333)',
          color: 'var(--toast-text, #fff)',
          border: '1px solid var(--toast-border, #444)',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    />
  </StrictMode>
);
