import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';


function EditarRifa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    total_numeros: ''
  });

  useEffect(() => {
    api.get(`/rifas/${id}`)
      .then(res => {
        setForm({
          nome: res.data.nome,
          descricao: res.data.descricao,
          total_numeros: res.data.total_numeros
        });
      })
      .catch(err => console.error('Erro ao carregar rifa:', err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/rifas/${id}`, {
        nome: form.nome,
        descricao: form.descricao,
        total_numeros: parseInt(form.total_numeros)
      });
      navigate('/');
    } catch (err) {
      alert('Erro ao salvar rifa');
    }
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Editar Rifa</h2>
      <form onSubmit={handleSubmit}>
        <input style={estilosGlobais.input} name="nome" value={form.nome} onChange={handleChange} required /><br />
        <textarea style={estilosGlobais.textarea} name="descricao" value={form.descricao} onChange={handleChange} /><br />
        <input style={estilosGlobais.input} name="total_numeros" type="number" value={form.total_numeros} onChange={handleChange} required /><br />
        <button style={estilosGlobais.button} type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}

export default EditarRifa;