
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Peer } from 'peerjs';

// Importações de componentes (Certifique-se que eles existam como .js ou remova as extensões se usar um bundler)
// Para o GitHub Pages puro, os componentes abaixo devem ser convertidos para .js também.
// Aqui simplificamos a lógica para rodar como um único arquivo ou garantir referências .js

const App = () => {
  const [session, setSession] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const peerRef = useRef(null);
  const connectionsRef = useRef([]);

  // Lógica de Sincronização P2P
  useEffect(() => {
    if (!session || !session.roomId) return;

    const roomId = session.roomId.toLowerCase().trim();
    const masterPeerId = `omega-rpg-room-${roomId}`;
    const currentPeerId = session.isMaster ? masterPeerId : null;

    const peer = new Peer(currentPeerId);
    peerRef.current = peer;

    peer.on('open', (id) => {
      console.log('Conectado ao servidor de sinalização com ID:', id);
      setIsConnected(true);
      if (!session.isMaster) {
        const conn = peer.connect(masterPeerId);
        setupConnection(conn);
      }
    });

    peer.on('connection', (conn) => {
      setupConnection(conn);
    });

    function setupConnection(conn) {
      conn.on('open', () => {
        connectionsRef.current.push(conn);
        console.log('Link P2P estabelecido!');
      });
      conn.on('data', (data) => {
        console.log('Dados recebidos:', data);
        // Aqui você processaria os status recebidos
      });
    }

    return () => {
      peer.destroy();
    };
  }, [session]);

  // Se não tiver sessão, mostra tela de entrada (LandingScreen)
  if (!session) {
    return React.createElement('div', { className: 'flex h-screen items-center justify-center bg-slate-950 p-4' },
      React.createElement('div', { className: 'bg-slate-900 border border-amber-600/30 p-8 rounded-2xl shadow-2xl w-full max-w-md' },
        React.createElement('h1', { className: 'text-3xl font-cinzel text-center text-amber-500 mb-6' }, 'SISTEMA ÔMEGA'),
        React.createElement('input', { 
          placeholder: 'ID da Missão (Ex: sala1)', 
          className: 'w-full bg-slate-950 border border-slate-700 p-3 rounded mb-4 text-white',
          id: 'room-input'
        }),
        React.createElement('button', {
          onClick: () => {
            const rid = document.getElementById('room-input').value;
            if(rid) setSession({ playerName: 'Usuário', roomId: rid, isMaster: true });
          },
          className: 'w-full py-3 bg-red-900 hover:bg-red-800 text-white font-bold rounded'
        }, 'INICIAR COMO MESTRE')
      )
    );
  }

  return React.createElement('div', { className: 'p-8' }, 
    React.createElement('h1', null, `Missão Ativa: ${session.roomId}`),
    React.createElement('p', null, isConnected ? '● LINK ATIVO' : '○ CONECTANDO...')
  );
};

export default App;
