import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Detecta o tema e aplica a classe no <body>
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.body.classList.add(prefersDark ? 'dark' : 'light');

// Escuta mudança no tema do sistema e troca classe do <body>
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  document.body.classList.toggle('dark', e.matches);
  document.body.classList.toggle('light', !e.matches);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
