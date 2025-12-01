const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ---------- LÓGICA DO JOGO DA MEMÓRIA ----------

const CARD_VALUES = ['🐱', '🐶', '🐵', '🐸', '🐼', '🦊', '🐧', '🐙']; // 8 pares

function createShuffledDeck() {
  const values = [...CARD_VALUES, ...CARD_VALUES]; // pares
  // Fisher–Yates shuffle
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values.map((value, index) => ({
    id: index,
    value,
    isRevealed: false,
    isMatched: false,
  }));
}

const state = {
  players: [], // { id, name, score }
  turn: 0,
  cards: [],
  revealedIndices: [], // índices temporariamente virados (máx 2)
  moveHistory: [], // { playerName, description, success, timestamp }
  isFinished: false,
};

function resetGame() {
  state.cards = createShuffledDeck();
  state.revealedIndices = [];
  state.moveHistory = [];
  state.isFinished = false;
  if (state.players.length > 0) {
    state.turn = 0;
    state.players.forEach(p => { p.score = 0; });
  } else {
    state.turn = 0;
  }
}

function allMatched() {
  return state.cards.length > 0 && state.cards.every(c => c.isMatched);
}

function broadcastState() {
  io.emit('state', {
    players: state.players,
    turn: state.turn,
    cards: state.cards,
    revealedIndices: state.revealedIndices,
    moveHistory: state.moveHistory.slice(-20), // limita histórico que vai pro front
    isFinished: state.isFinished,
  });
}

// Inicializa baralho ao iniciar servidor (será resetado ao primeiro join também)
resetGame();

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join', (name) => {
    if (!name || typeof name !== 'string') return;
    const trimmed = name.trim();
    if (!trimmed) return;

    // Evita duplicar se já existe com esse socket
    let existing = state.players.find(p => p.id === socket.id);
    if (!existing) {
      state.players.push({
        id: socket.id,
        name: trimmed,
        score: 0,
      });
      console.log('Jogador entrou:', trimmed);

      if (state.players.length === 1) {
        // primeiro jogador inicia jogo
        resetGame();
      }
      // Se jogadores estavam 0 e viraram 1, reset já foi feito em resetGame
      broadcastState();
    }
  });

  socket.on('flipCard', (index) => {
    if (state.isFinished) return;
    if (typeof index !== 'number') return;
    if (index < 0 || index >= state.cards.length) return;
    if (state.revealedIndices.length >= 2) return;

    const currentPlayer = state.players[state.turn];
    if (!currentPlayer || currentPlayer.id !== socket.id) {
      socket.emit('errorMessage', 'Não é sua vez!');
      return;
    }

    const card = state.cards[index];
    if (card.isMatched || card.isRevealed) {
      return; // não faz nada
    }

    card.isRevealed = true;
    state.revealedIndices.push(index);
    broadcastState();

    if (state.revealedIndices.length === 2) {
      const [i1, i2] = state.revealedIndices;
      const c1 = state.cards[i1];
      const c2 = state.cards[i2];
      const isMatch = c1.value === c2.value;

      const move = {
        playerName: currentPlayer.name,
        description: `Virou cartas ${i1 + 1} e ${i2 + 1} (${c1.value} / ${c2.value})`,
        success: isMatch,
        timestamp: new Date().toISOString(),
      };
      state.moveHistory.push(move);

      if (isMatch) {
        c1.isMatched = true;
        c2.isMatched = true;
        currentPlayer.score += 1;
        state.revealedIndices = [];

        if (allMatched()) {
          state.isFinished = true;
        }

        broadcastState();
      } else {
        // Erro: espera um pouco, depois desvira e passa turno
        setTimeout(() => {
          const [j1, j2] = state.revealedIndices;
          if (
            typeof j1 === 'number' &&
            typeof j2 === 'number' &&
            !state.cards[j1].isMatched &&
            !state.cards[j2].isMatched
          ) {
            state.cards[j1].isRevealed = false;
            state.cards[j2].isRevealed = false;
          }
          state.revealedIndices = [];
          if (state.players.length > 0) {
            state.turn = (state.turn + 1) % state.players.length;
          }
          broadcastState();
        }, 1000);
      }
    }
  });

  socket.on('resetGame', () => {
    const currentPlayer = state.players[state.turn];
    if (!currentPlayer || currentPlayer.id !== socket.id) {
      socket.emit('errorMessage', 'Somente o jogador da vez pode reiniciar a partida.');
      return;
    }
    resetGame();
    broadcastState();
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    const index = state.players.findIndex(p => p.id === socket.id);
    if (index !== -1) {
      state.players.splice(index, 1);
      if (state.players.length === 0) {
        // zera tudo
        resetGame();
      } else {
        state.turn = state.turn % state.players.length;
      }
      broadcastState();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Backend (jogo da memória) ouvindo na porta', PORT);
});
