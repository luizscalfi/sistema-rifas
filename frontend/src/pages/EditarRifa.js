import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';

function NovaRifa() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [total_numeros, setTotalNumeros] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const salvar = () => {
    api.post('/rifas', { nome, descricao, total_numeros })
      .then(() => navigate('/'))
      .catch(() => setErro('Erro ao criar rifa.'));
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Nova Rifa</h2>
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
      <input placeholder="Total de Números" type="number" value={total_numeros} onChange={e => setTotalNumeros(e.target.value)} />
      <button onClick={salvar} style={estilosGlobais.button}>Salvar</button>
      {erro && <p style={estilosGlobais.errorText}>{erro}</p>}
    </div>
  );
}

export default NovaRifa;
