import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';

function Sorteio() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/rifas/${id}`)
      .then(res => setRifa(res.data))
      .catch(() => setErro('Erro ao carregar dados da rifa.'));
  }, [id]);

  const sortear = async () => {
    setErro('');
    setResultado(null);
    setLoading(true);
    try {
      const res = await api.post(`/rifas/${id}/sortear`);
      setResultado(res.data);
    } catch (err) {
      setErro('Não foi possível realizar o sorteio. Verifique se há compradores com números válidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Sorteio da Rifa</h2>

      {rifa ? (
        <>
          <p><strong>{rifa.nome}</strong>: {rifa.descricao}</p>
          <button onClick={sortear} style={estilosGlobais.button} disabled={loading}>
            {loading ? 'Sorteando...' : '🎲 Realizar Sorteio'}
          </button>

          {erro && <p style={estilosGlobais.errorText}>{erro}</p>}

          {resultado && (
            <div style={{ marginTop: '20px' }}>
              <h3>🎉 Resultado</h3>
              <p><strong>Número sorteado:</strong> {resultado.numero_sorteado}</p>
              <p><strong>Ganhador:</strong> {resultado.ganhador.nome} ({resultado.ganhador.contato})</p>
            </div>
          )}
        </>
      ) : (
        <p>Carregando informações da rifa...</p>
      )}
    </div>
  );
}

export default Sorteio;
