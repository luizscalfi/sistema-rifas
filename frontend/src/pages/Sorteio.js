import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';


function Sorteio() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get(`/rifas/${id}`)
      .then(res => setRifa(res.data))
      .catch(() => setErro('Erro ao carregar rifa'));
  }, [id]);

  const sortear = async () => {
    setErro('');
    try {
      const res = await api.post(`/rifas/${id}/sortear`);
      setResultado(res.data);
    } catch (err) {
      setErro('Erro no sorteio. Verifique se há compradores.');
    }
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Sorteio</h2>
      {rifa && <p><strong>{rifa.nome}</strong>: {rifa.descricao}</p>}
      <button style={estilosGlobais.button} onClick={sortear}>🎲 Sortear</button>
      {erro && <p style={estilosGlobais.errorText}>{erro}</p>}
      {resultado && (
        <div style={estilosGlobais.container}>
          <h3>Resultado</h3>
          <p><strong>Número sorteado:</strong> {resultado.numero_sorteado}</p>
          <p><strong>Ganhador:</strong> {resultado.ganhador.nome} ({resultado.ganhador.contato})</p>
        </div>
      )}
    </div>
  );
}

export default Sorteio;