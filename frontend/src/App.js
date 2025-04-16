import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import RifaList from './RifaList';
import NovaRifa from './NovaRifa';
import EditarRifa from './EditarRifa';
import RifaDetalhes from './RifaDetalhes';
import EditarComprador from './EditarComprador';
import Sorteio from './Sorteio';
import { estilosGlobais } from './estilos';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const temaSalvo = localStorage.getItem('darkMode');
    if (temaSalvo) setDarkMode(JSON.parse(temaSalvo));
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const tema = {
    backgroundColor: darkMode ? '#121212' : '#fff',
    color: darkMode ? '#eee' : '#000',
    minHeight: '100vh'
  };

  return (
    <div style={{ ...estilosGlobais.container, ...tema }}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: darkMode ? '#333' : '#ddd',
          color: darkMode ? '#fff' : '#000',
          padding: '8px 12px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {darkMode ? '🌞 Claro' : '🌙 Escuro'}
      </button>

      <h1 style={estilosGlobais.titulo}>Sistema de Rifas</h1>
      <Routes>
        <Route path="/" element={<RifaList />} />
        <Route path="/nova-rifa" element={<NovaRifa />} />
        <Route path="/rifas/:id/editar" element={<EditarRifa />} />
        <Route path="/rifas/:id" element={<RifaDetalhes />} />
        <Route path="/compradores/:id/editar" element={<EditarComprador />} />
        <Route path="/rifas/:id/sorteio" element={<Sorteio />} />
        <Route path="*" element={<p>❌ Página não encontrada</p>} />
      </Routes>
    </div>
  );
}

export default App;
