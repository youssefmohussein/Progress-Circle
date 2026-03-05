import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Extension removed or changed to .jsx
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);