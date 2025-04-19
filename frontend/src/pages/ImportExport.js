import React from 'react';
import api from '../services/api';

function ImportExport({ id, compradores = [], onImportSuccess = () => {} }) {
  const [arquivo, setArquivo] = React.useState(null);

  const handleImport = async () => {
    if (!arquivo) {
      alert('Selecione um arquivo CSV primeiro.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('arquivo', arquivo);

      await api.post(`/rifas/${id}/importar_compradores`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('✅ Importação concluída com sucesso!');
      setArquivo(null);
      onImportSuccess();
    } catch (err) {
      const msg =
        err.response?.data?.erro ||
        err.response?.data?.mensagem ||
        err.message ||
        'Erro desconhecido ao importar.';
      alert(`❌ Erro ao importar compradores: ${msg}`);
    }
  };

  const handleExport = () => {
    if (compradores.length === 0) {
      alert('Nenhum comprador para exportar.');
      return;
    }

    const csvContent =
      'id,nome,contato,numeros\n' +
      compradores
        .map(
          (c) =>
            `${c.id},"${c.nome}","${c.contato}","${c.numeros.join(', ')}"`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `compradores_rifa_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <label>
        <strong>Importar compradores:</strong>{' '}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setArquivo(e.target.files[0])}
        />
      </label>
      <button
        onClick={handleImport}
        style={{
          marginLeft: '0px',
          padding: '6px 10px',
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Importar
      </button>

      <button
        onClick={handleExport}
        style={{
          marginLeft: '10px',
          padding: '6px 10px',
          backgroundColor: '#2e7d32',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Exportar compradores
      </button>
    </div>
  );
}

export default ImportExport;
