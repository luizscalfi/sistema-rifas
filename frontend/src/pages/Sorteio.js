import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';
import { Wheel } from 'react-custom-roulette';

function Sorteio() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(`/rifas/${id}`)
      .then(res => {
        setRifa(res.data);

        const numeros = res.data.numeros.map((num, idx) => ({
          option: num.toString()
        }));
        setData(numeros);
      })
      .catch(() => setErro('Erro ao carregar rifa'));
  }, [id]);

  const sortear = async () => {
    setErro('');
    setResultado(null);

    try {
      const res = await api.post(`/rifas/${id}/sortear`);
      const numeroSorteado = res.data.numero_sorteado;

      const index = data.findIndex(d => d.option === numeroSorteado.toString());

      if (index >= 0) {
        setPrizeNumber(index);
        setMustSpin(true);
        setResultado(res.data);
      } else {
        setErro('Número sorteado não encontrado na lista.');
      }

    } catch (err) {
      setErro('Erro no sorteio. Verifique se há compradores.');
    }
  };

  return (
    <div style={estilosGlobais.container}>
      <h2 style={estilosGlobais.titulo}>Sorteio</h2>

      {rifa && <p><strong>{rifa.nome}</strong>: {rifa.descricao}</p>}

      {data.length > 0 && (
        <div style={{ margin: '40px 0' }}>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            backgroundColors={['#3e3e3e', '#df3428']}
            textColors={['#ffffff']}
            onStopSpinning={() => setMustSpin(false)}
          />
        </div>
      )}

      <button style={estilosGlobais.button} onClick={sortear}>🎲 Girar Roleta</button>

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
