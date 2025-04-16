import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';

function RifaList() {
  const [rifas, setRifas] = useState([]);

  useEffect(() => {
    api.get('/rifas')
      .then(res => setRifas(res.data))
      .catch(() => alert('Erro ao carregar rifas.'));
  }, []);

  return (
    <div>
      <Link to="/nova-rifa" style={estilosGlobais.button}>➕ Nova Rifa</Link>
      <ul>
        {rifas.map(rifa => (
          <li key={rifa.id} style={{ marginBottom: '10px' }}>
            <strong>{rifa.nome}</strong> - {rifa.descricao}
            <div>
              <Link to={`/rifas/${rifa.id}`} style={estilosGlobais.link}>🔍 Ver</Link>
              <Link to={`/rifas/${rifa.id}/editar`} style={{ marginLeft: '10px' }}>✏️ Editar</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RifaList;
