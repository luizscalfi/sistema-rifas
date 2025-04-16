import React, { useRef } from 'react';
import api from '../services/api';

const ImportExport = ({ rifaId }) => {
  const fileInput = useRef(null);

  const exportarCSV = () => {
    window.open(`${api.defaults.baseURL}/rifas/${rifaId}/exportar_compradores`, '_blank');
  };

  const importarCSV = async () => {
    const file = fileInput.current.files[0];
    if (!file) return alert('Selecione um arquivo CSV');

    const formData = new FormData();
    formData.append('arquivo', file);

    try {
      await api.post(`/rifas/${rifaId}/importar_compradores`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Importação concluída com sucesso!');
    } catch (error) {
      alert('Erro ao importar: ' + error.message);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Importar / Exportar Compradores</h3>
      <input type="file" ref={fileInput} accept=".csv" />
      <button onClick={importarCSV}>Importar CSV</button>
      <button onClick={exportarCSV}>Exportar CSV</button>
      <a href="/modelo_compradores.csv" download>
        📥 Baixar modelo CSV
      </a>
    </div>
  );
};

export default ImportExport;
