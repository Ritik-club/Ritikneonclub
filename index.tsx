
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Initialize deferredPrompt to null to avoid syntax errors
let deferredPrompt: any = null;

const rootElement: HTMLElement | null = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.addEventListener('beforeinstallprompt', (e: any) => {
  e.preventDefault();
  deferredPrompt = e;
});

console.log("Ritik Club Protocol Initialized...");
