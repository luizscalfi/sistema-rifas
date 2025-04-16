import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';

function EditarComprador() {
  const { id } = useParams();
  const [comprador, setComprador] = useState({ nome: '', contato: '', numeros: '' });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/compradores/${id}`)
      .then(res => setComprador(res.data))
      .catch(() => setErro('Erro ao carregar comprador.'));
  }, [id]);

  const handleChange = (e) => {
    setComprador({ ...comprador, [e.target.name]: e.target.value });
  };

  const salvar = () => {
    api.put(`/compradores/${id}`, comprador)
      .then(() => navigate(-1))
      .catch(() => setErro('Erro ao atualizar comprador.'));
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Editar Comprador</h2>
      <input name="nome" placeholder="Nome" value={comprador.nome} onChange={handleChange} />
      <input name="contato" placeholder="Contato" value={comprador.contato} onChange={handleChange} />
      <input name="numeros" placeholder="Números" value={comprador.numeros} onChange={handleChange} />
      <button onClick={salvar} style={estilosGlobais.button}>Salvar</button>
      {erro && <p style={estilosGlobais.errorText}>{erro}</p>}
    </div>
  );
}

export default EditarComprador;
