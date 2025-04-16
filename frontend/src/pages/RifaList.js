import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { estilosGlobais } from '../estilos';

function RifaList() {
  const [rifas, setRifas] = useState([]);
  const navigate = useNavigate();

  const carregar = () => {
    api.get('/rifas')
      .then(res => setRifas(res.data))
      .catch(err => console.error('Erro ao carregar rifas:', err));
  };

  useEffect(() => {
    carregar();
  }, []);

  const deletar = async (id) => {
    if (window.confirm('Deseja realmente excluir esta rifa?')) {
      try {
        await api.delete(`/rifas/${id}`);
        carregar();
      } catch (err) {
        alert('Erro ao excluir');
      }
    }
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Rifas Cadastradas</h2>

      <div style={{ marginBottom: '20px' }}>
        <Link
          to="/nova-rifa"
          style={{
            ...estilosGlobais.button,
            textDecoration: 'none',
            display: 'inline-block',
            textAlign: 'center'
          }}
        >
          ➕ Nova Rifa
        </Link>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rifas.map(rifa => (
          <li style={estilosGlobais.listItem} key={rifa.id}>
            <strong>{rifa.nome}</strong> — {rifa.total_numeros} números
            <br />
            <div style={{ marginTop: '8px' }}>
              <Link
                to={`/rifas/${rifa.id}`}
                style={{
                  ...estilosGlobais.button,
                  marginRight: '8px',
                  textDecoration: 'none'
                }}
              >
                👤 Detalhes
              </Link>
              <Link
                to={`/rifas/${rifa.id}/editar`}
                style={{
                  ...estilosGlobais.button,
                  marginRight: '8px',
                  textDecoration: 'none'
                }}
              >
                ✏️ Editar
              </Link>
              <button
                style={{
                  ...estilosGlobais.button,
                  backgroundColor: '#d32f2f'
                }}
                onClick={() => deletar(rifa.id)}
              >
                🗑️ Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RifaList;
