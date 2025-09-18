import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Function to mount the micro-frontend
const mount = (element: HTMLElement, options?: { language?: string; onLanguageChange?: (lang: string) => void }) => {
  const root = ReactDOM.createRoot(element);
  root.render(
    <React.StrictMode>
      <App initialLanguage={options?.language} onLanguageChange={options?.onLanguageChange} />
    </React.StrictMode>
  );
  return root;
};

// Function to unmount the micro-frontend
const unmount = (root: any) => {
  if (root && root.unmount) {
    root.unmount();
  }
};

// Expose functions globally for micro-frontend integration
declare global {
  interface Window {
    shellConfigAdminFrontend: {
      mount: typeof mount;
      unmount: typeof unmount;
    };
  }
}

window.shellConfigAdminFrontend = {
  mount,
  unmount,
};

// If running standalone, mount to root element
if (document.getElementById('root')) {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Hot Module Replacement (HMR) - Vite specific
if ((import.meta as any).hot) {
  (import.meta as any).hot.accept();
}