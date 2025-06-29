// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.module.css'; // ou seu CSS global
import { BrowserRouter as Router } from 'react-router-dom'; // Importe o Router aqui

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router> {}
      <App /> {}
    </Router>
  </React.StrictMode>,
);