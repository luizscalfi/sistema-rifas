import React, { useEffect, useState } from 'react';
import ImportExport from './ImportExport';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';

function RifaDetalhes() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [compradores, setCompradores] = useState([]);
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [numeros, setNumeros] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarRifa();
    carregarCompradores();
  }, []);

  const carregarRifa = async () => {
    const res = await api.get(`/rifas/${id}`);
    setRifa(res.data);
  };

  const carregarCompradores = async () => {
    const res = await api.get(`/rifas/${id}/compradores`);
    setCompradores(res.data);
  };

  const adicionarComprador = async (e) => {
    e.preventDefault();
    const numerosNovos = numeros.split(',').map(n => parseInt(n.trim()));
    const numerosJaEscolhidos = compradores.flatMap(c => c.numeros);

    const duplicados = numerosNovos.filter(n => numerosJaEscolhidos.includes(n));
    const foraDoLimite = numerosNovos.filter(n => n < 1 || n > rifa.total_numeros);

    if (duplicados.length > 0) {
      alert(`Os números ${duplicados.join(', ')} já foram escolhidos.`);
      return;
    }

    if (foraDoLimite.length > 0) {
      alert(`Os números ${foraDoLimite.join(', ')} estão fora do limite da rifa (1 a ${rifa.total_numeros}).`);
      return;
    }

    try {
      await api.post(`/rifas/${id}/compradores`, {
        nome,
        contato,
        numeros: numerosNovos
      });
      setNome('');
      setContato('');
      setNumeros('');
      carregarCompradores();
    } catch (err) {
      alert('Erro ao adicionar comprador');
    }
  };

  const deletarComprador = async (compradorId) => {
    if (window.confirm('Excluir este comprador?')) {
      await api.delete(`/compradores/${compradorId}`);
      carregarCompradores();
    }
  };

  const irParaSorteio = () => {
    navigate(`/rifas/${id}/sorteio`);
  };

  if (!rifa) return <p>Carregando...</p>;

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>{rifa.nome}</h2>
      <p>{rifa.descricao}</p>
      <p><strong>Total:</strong> {rifa.total_numeros}</p>

      <button
        style={{
          ...estilosGlobais.button,
          marginBottom: '20px',
          padding: '10px'
        }}
        onClick={irParaSorteio}
      >
        🎉 Ir para Sorteio
      </button>

      <h3>Compradores</h3>
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '4px'
      }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {compradores.map(c => (
            <li style={estilosGlobais.listItem} key={c.id}>
              <div style={{ marginBottom: '6px' }}>
                <strong>{c.nome}</strong> — {c.contato}
                <br />
                Números: {c.numeros.join(', ')}
              </div>
              <div>
                <Link
                  style={{ ...estilosGlobais.button, marginRight: '8px', textDecoration: 'none' }}
                  to={`/compradores/${c.id}/editar`}
                >
                  ✏️ Editar
                </Link>
                <button
                  style={{ ...estilosGlobais.button, backgroundColor: '#d32f2f' }}
                  onClick={() => deletarComprador(c.id)}
                >
                  🗑️ Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ImportExport rifaId={id} />

      <h4>Adicionar Comprador</h4>
      <form onSubmit={adicionarComprador}>
        <input
          style={estilosGlobais.input}
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome"
          required
        /><br />
        <input
          style={estilosGlobais.input}
          value={contato}
          onChange={e => setContato(e.target.value)}
          placeholder="Contato"
        /><br />
        <input
          style={estilosGlobais.input}
          value={numeros}
          onChange={e => setNumeros(e.target.value)}
          placeholder="Números (1,2,3)"
          required
        /><br />
        <button
          style={{ ...estilosGlobais.button, marginTop: '10px' }}
          type="submit"
        >
          ➕ Adicionar
        </button>
      </form>
    </div>
  );
}

export default RifaDetalhes;