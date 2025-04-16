import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';

function EditarComprador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    contato: '',
    numeros: ''
  });

  const [rifa, setRifa] = useState(null);
  const [compradores, setCompradores] = useState([]);
  const [rifaId, setRifaId] = useState(null);

  useEffect(() => {
    api.get(`/compradores/${id}`)
      .then(res => {
        const comprador = res.data;
        setForm({
          nome: comprador.nome,
          contato: comprador.contato,
          numeros: comprador.numeros.join(', ')
        });
        setRifaId(comprador.rifa_id);
        carregarRifa(comprador.rifa_id);
        carregarCompradores(comprador.rifa_id, comprador.id);
      })
      .catch(err => console.error('Erro ao carregar comprador:', err));
  }, [id]);

  const carregarRifa = async (rifaId) => {
    const res = await api.get(`/rifas/${rifaId}`);
    setRifa(res.data);
  };

  const carregarCompradores = async (rifaId, idAtual) => {
    const res = await api.get(`/rifas/${rifaId}/compradores`);
    const outros = res.data.filter(c => c.id !== parseInt(idAtual));
    setCompradores(outros);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numerosNovos = form.numeros.split(',').map(n => parseInt(n.trim()));
    const numerosJaEscolhidos = compradores.flatMap(c => c.numeros);

    const duplicados = numerosNovos.filter(n => numerosJaEscolhidos.includes(n));
    const foraDoLimite = numerosNovos.filter(n => n < 1 || n > rifa.total_numeros);

    if (duplicados.length > 0) {
      alert(`Os números ${duplicados.join(', ')} já foram escolhidos por outro comprador.`);
      return;
    }

    if (foraDoLimite.length > 0) {
      alert(`Os números ${foraDoLimite.join(', ')} estão fora do limite da rifa (1 a ${rifa.total_numeros}).`);
      return;
    }

    await api.put(`/compradores/${id}`, {
      nome: form.nome,
      contato: form.contato,
      numeros: numerosNovos
    });

    navigate(-1);
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Editar Comprador</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={estilosGlobais.input}
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome"
          required
        /><br />
        <input
          style={estilosGlobais.input}
          name="contato"
          value={form.contato}
          onChange={handleChange}
          placeholder="Contato"
        /><br />
        <input
          style={estilosGlobais.input}
          name="numeros"
          value={form.numeros}
          onChange={handleChange}
          placeholder="Números (1,2,3)"
          required
        /><br />
        <button style={{ ...estilosGlobais.button, marginTop: '10px' }} type="submit">
          💾 Salvar
        </button>
      </form>
    </div>
  );
}

export default EditarComprador;
