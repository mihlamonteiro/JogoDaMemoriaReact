# Jogo da Memória Multiplayer – React + Vite + Socket.IO

## Estrutura

- **Backend**: Node.js + Express + Socket.IO
  - Controla:
    - Baralho de cartas (pares de emojis)
    - Jogadores conectados
    - Vez do jogador
    - Lógica de virar carta, validar par, contar pontos
    - Histórico de jogadas
    - Fim de jogo (todas as cartas encontradas)

- **Frontend**: React + Vite
  - Página inicial:
    - Campo para informar nome do jogador
    - Botão para entrar na partida
  - Tela do jogo:
    - Placar em TABELA (dinâmica)
    - Lista de jogadas (LISTA dinâmica)
    - Tabuleiro de cartas (animação simples via CSS)
    - Destaque visual do jogador da vez

## Como rodar

### 1) Backend

```bash
cd backend
npm install
npm start
```

Isso sobe o servidor na porta `3000`.

### 2) Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite vai subir na porta `5173`.  
Abra: http://localhost:5173

Abra em **dois navegadores/computadores diferentes**, coloque nomes diferentes e acompanhe:
- Vez alternando entre jogadores
- Pares sendo encontrados e marcados
- Histórico de jogadas sendo atualizado em tempo real
