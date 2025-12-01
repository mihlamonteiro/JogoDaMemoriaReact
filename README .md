# 🧠 Jogo da Memória Multiplayer – React + Vite + Socket.IO

Este é um jogo da memória multiplayer em tempo real, onde dois ou mais jogadores, em computadores diferentes, se conectam ao mesmo servidor e jogam alternando turnos.  
Toda a lógica — baralho, viradas, validação de pares, pontuação, vez, histórico — roda **no backend**.  
O frontend em React recebe apenas o estado e renderiza tudo sem acessar o DOM diretamente.

---

## 🚀 Tecnologias utilizadas

### **Frontend**
- React 18  
- Vite  
- Socket.IO Client  
- CSS puro (tema escuro + animações)

### **Backend**
- Node.js  
- Express  
- Socket.IO  

---

## 📁 Estrutura do projeto

```
memory_game_vite/
  backend/
    package.json
    server.js
  frontend/
    package.json
    vite.config.mjs
    index.html
    src/
      main.jsx
      App.jsx
      socket.js
      index.css
  README.md
```

---

## ⚙️ Como rodar o projeto

### ▶️ 1. Rodar o backend

```bash
cd backend
npm install
npm start
```

Servidor inicia em **http://localhost:3000**.

---

### ▶️ 2. Rodar o frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend inicia em **http://localhost:5173**.

---

## 🧪 Testando o multiplayer

Para testar corretamente:

1. Abra **duas janelas**:
   - Chrome normal + Chrome anônimo  
   - OU Chrome + Firefox  
   - OU dois PCs diferentes  
2. Entre na partida com nomes diferentes  
3. Verifique:
   - Turno alternando  
   - Cartas virando ao mesmo tempo  
   - Histórico sincronizado  
   - Pontuação atualizando nas duas telas  

Se tudo sincronizar → multiplayer funcionando perfeitamente.

---

## 🎮 Como o jogo funciona

- Jogador da vez pode virar **duas cartas**
- Se acertar → ganha ponto e mantém a vez  
- Se errar → cartas desviram e passa a vez  
- Quando todos os pares forem encontrados → partida termina  
- Jogador da vez pode reiniciar a partida  

---

## ✔️ Requisitos do professor atendidos

- Implementado em **React**
- Sem uso do DOM direto  
- Lógica totalmente no backend  
- Multiplayer real-time  
- Tabela dinâmica  
- Lista dinâmica  
- Estilos dinâmicos  
- Duas páginas (Home + Game)  
- CSS organizado  

---

