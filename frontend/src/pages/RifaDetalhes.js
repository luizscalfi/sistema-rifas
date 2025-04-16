import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';

function RifaDetalhes() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [compradores, setCompradores] = useState([]);
  const [novoComprador, setNovoComprador] = useState({ nome: '', contato: '', numeros: '' });
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get(`/rifas/${id}`).then(res => setRifa(res.data));
    api.get(`/rifas/${id}/compradores`).then(res => setCompradores(res.data));
  }, [id]);

  const handleChange = (e) => {
    setNovoComprador({ ...novoComprador, [e.target.name]: e.target.value });
  };

  const adicionarComprador = () => {
    setErro('');
    api.post(`/rifas/${id}/compradores`, novoComprador)
      .then(res => {
        setCompradores([...compradores, res.data]);
        setNovoComprador({ nome: '', contato: '', numeros: '' });
      })
      .catch(() => setErro('Erro ao adicionar comprador.'));
  };

  if (!rifa) return <p>Carregando...</p>;

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Rifa: {rifa.nome}</h2>
      <p><strong>Descrição:</strong> {rifa.descricao}</p>
      <p><strong>Total de Números:</strong> {rifa.total_numeros}</p>

      <h3>Compradores:</h3>
      <ul>
        {compradores.map((c) => (
          <li key={c.id}>
            {c.nome} ({c.contato}) — Números: {c.numeros}
            <Link to={`/compradores/${c.id}/editar`} style={{ marginLeft: 10 }}>
              ✏️ Editar
            </Link>
          </li>
        ))}
      </ul>

      <h3>Adicionar Comprador:</h3>
      <input name="nome" placeholder="Nome" value={novoComprador.nome} onChange={handleChange} />
      <input name="contato" placeholder="Contato" value={novoComprador.contato} onChange={handleChange} />
      <input name="numeros" placeholder="Números (ex: 1,2,3)" value={novoComprador.numeros} onChange={handleChange} />
      <button onClick={adicionarComprador} style={estilosGlobais.button}>Adicionar</button>

      <br />
      <Link to={`/rifas/${id}/sorteio`} style={estilosGlobais.button}>🎲 Fazer Sorteio</Link>
      {erro && <p style={estilosGlobais.errorText}>{erro}</p>}
    </div>
  );
}

export default RifaDetalhes;
