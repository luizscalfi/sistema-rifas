import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { estilosGlobais } from '../estilos';
import { Wheel } from 'react-custom-roulette';

function Sorteio() {
  const { id } = useParams();
  const [rifa, setRifa] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [erro, setErro] = useState('');
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [exibirRoleta, setExibirRoleta] = useState(true);

  const fakeData = new Array(10).fill({ option: '' });

  useEffect(() => {
    api.get(`/rifas/${id}`)
      .then(res => {
        setRifa(res.data);
      })
      .catch((err) => {
        console.error('Erro ao carregar rifa:', err);
        setErro('Erro ao carregar rifa');
      });
  }, [id]);

  const sortear = async () => {
    setErro('');
    setResultado(null);
    setMostrarResultado(false);
    setExibirRoleta(true);

    try {
      const res = await api.post(`/rifas/${id}/sortear`);

      const posicaoAleatoria = Math.floor(Math.random() * fakeData.length);
      setPrizeNumber(posicaoAleatoria);
      setMustSpin(true);

      setResultado(res.data);
    } catch (err) {
      setErro('Erro no sorteio. Verifique se há compradores.');
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setExibirRoleta(false);
    setMostrarResultado(true);
  };

  return (
    <div style={{
      ...estilosGlobais.container,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h2 style={estilosGlobais.titulo}>Sorteio</h2>

      {rifa && <p><strong>{rifa.nome}</strong>: {rifa.descricao}</p>}

      {exibirRoleta && (
        <div style={{ margin: '0px 0', transform: 'scale(0.8)', transformOrigin: 'center' }}>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={fakeData}
            backgroundColors={['#1FA667', '#8C2703']}
            textColors={['#ffffff']}
            outerBorderColor="#591202"
            outerBorderWidth={3}
            radiusLineColor="#D90404"
            radiusLineWidth={2}
            fontSize={18}
            onStopSpinning={handleStopSpinning}
          />
        </div>
      )}

      {!mustSpin && !mostrarResultado && (
        <button style={estilosGlobais.buttonSort} onClick={sortear}> 🎲 Sortear</button>
      )}

      {erro && <p style={estilosGlobais.errorText}>{erro}</p>}

      {resultado && mostrarResultado && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>🎉 Resultado do sorteio! 🎉</h3>
          <p style={{ fontSize: '22px', fontWeight: 'bold' }}>
            <strong>Número sorteado:</strong> {resultado.numero_sorteado}
          </p>
          <p style={{ fontSize: '22px', fontWeight: 'bold' }}>
            <strong>Ganhador:</strong> {resultado.ganhador.nome}
          </p>
        </div>
      )}
    </div>
  );
}

export default Sorteio;
