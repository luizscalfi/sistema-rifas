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
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState('asc');
  const [busca, setBusca] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
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
      alert(`Os números ${foraDoLimite.join(', ')} estão fora do limite.`);
      return;
    }

    await api.post(`/rifas/${id}/compradores`, {
      nome,
      contato,
      numeros: numerosNovos
    });

    setNome('');
    setContato('');
    setNumeros('');
    setMensagemSucesso('✅ Comprador cadastrado com sucesso!');
    setTimeout(() => setMensagemSucesso(''), 4000);
    carregarCompradores();
  };

  const totalNumeros = rifa?.total_numeros || 0;
  const numerosComprados = compradores.flatMap(c => c.numeros);
  const todosNumeros = Array.from({ length: totalNumeros }, (_, i) => i + 1);
  const qtdCompradas = numerosComprados.length;
  const qtdDisponiveis = totalNumeros - qtdCompradas;

  const sortedCompradores = [...compradores].sort((a, b) => {
    if (sortBy === 'nome') {
      return sortOrder === 'asc'
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    } else if (sortBy === 'qtd') {
      const diff = a.numeros.length - b.numeros.length;
      return sortOrder === 'asc' ? diff : -diff;
    }
    return 0;
  });

  const compradoresFiltrados = sortedCompradores.filter((c) => {
    const buscaLower = busca.toLowerCase();
    const nomeMatch = c.nome.toLowerCase().includes(buscaLower);
    const numeroMatch = c.numeros.some(n => n.toString().includes(buscaLower));
    return nomeMatch || numeroMatch;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>{rifa?.nome}</h2>
      <p>{rifa?.descricao}</p>

      <form onSubmit={adicionarComprador}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={estilosGlobais.input}
        />
        <input
          type="text"
          placeholder="Contato"
          value={contato}
          onChange={(e) => setContato(e.target.value)}
          style={estilosGlobais.input}
        />
        <input
          type="text"
          placeholder="Números (ex: 1, 2, 3)"
          value={numeros}
          onChange={(e) => setNumeros(e.target.value)}
          style={estilosGlobais.input}
        />
        <button type="submit" style={estilosGlobais.button}>Adicionar Comprador</button>
      </form>

      {mensagemSucesso && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '10px',
          borderRadius: '4px',
          marginTop: '10px',
          fontWeight: 'bold'
        }}>
          {mensagemSucesso}
        </div>
      )}

      <ImportExport id={id} compradores={compradores} />

      <div style={{
        marginTop: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Lista de Compradores</h3>
        <input
          type="text"
          placeholder="Buscar por nome ou número"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '220px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="tabela-compradores">
          <thead>
            <tr>
              <th onClick={() => toggleSort('nome')} style={{ cursor: 'pointer' }}>
                Nome {sortBy === 'nome' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th>Contato</th>
              <th onClick={() => toggleSort('qtd')} style={{ cursor: 'pointer' }}>
                Números {sortBy === 'qtd' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {compradoresFiltrados.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.contato}</td>
                <td>{c.numeros.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginTop: '30px' }}>Números da Rifa</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
        gap: '6px',
        maxWidth: '100%',
        width: '100%',
        padding: '10px'
      }}>
        {todosNumeros.map((num) => {
          const comprado = numerosComprados.includes(num);
          return (
            <div key={num} className={`numero ${comprado ? 'comprado' : ''}`}>
              {num}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px' }}>
        <p><strong>Quantidade de Rifas Compradas:</strong> {qtdCompradas}</p>
        <p><strong>Quantidade de Rifas Disponíveis:</strong> {qtdDisponiveis}</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to={`/rifas/${id}/sorteio`}
          style={{
            ...estilosGlobais.button,
            backgroundColor: '#D90404',
            display: 'inline-block',
            marginRight: '10px'
          }}
        >
          Ir para Sorteio 🎯
        </Link>

        <Link
          to="/"
          style={{ ...estilosGlobais.button, display: 'inline-block' }}
        >
          Voltar para lista de Rifas
        </Link>
      </div>
    </div>
  );
}

export default RifaDetalhes;
