
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Global variable to store install prompt event
let deferredPrompt: any;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});
