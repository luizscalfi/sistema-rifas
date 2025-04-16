import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { estilosGlobais } from '../estilos';


function NovaRifa() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [totalNumeros, setTotalNumeros] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rifas', {
        nome,
        descricao,
        total_numeros: parseInt(totalNumeros)
      });
      navigate('/');
    } catch (err) {
      alert('Erro ao criar rifa');
    }
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Nova Rifa</h2>
      <form onSubmit={handleSubmit}>
        <input style={estilosGlobais.input} value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" required /><br />
        <textarea style={estilosGlobais.textarea} value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição" /><br />
        <input style={estilosGlobais.input} type="number" value={totalNumeros} onChange={e => setTotalNumeros(e.target.value)} placeholder="Total de Números" required /><br />
        <button style={estilosGlobais.button} type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default NovaRifa;