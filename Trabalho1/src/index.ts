import express from "express";
import cors from "cors";
import { users } from "./data";
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

app.use(cors());
// Exercício 2: Hello, Express!
// 1. Objetivo: Criar um servidor Express que responde com "Hello, Express!" quando alguém acessa a raiz ("/").
// 2. Instruções:
// Crie um arquivo chamado index.ts .
// Importe o pacote Express e configure o servidor para escutar na porta 3000.
// Adicione uma rota GET para a raiz ("/") que envia a resposta "Hello, Express!".
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Exercício 3: Enviando JSON
// 1. Objetivo: Modificar o servidor Express para enviar um objeto JSON quando acessado em uma nova rota.
// 2. Instruções:
// Adicione uma rota GET para "/users" que envie a variável users como uma resposta JSON.
app.get("/users", (req, res) => {
  res.send(users);
});

// Exercício 4: Parâmetros de Rota
// 1. Objetivo: Aprender a usar parâmetros de rota para enviar informações específicas.
// 2. Instruções:
// Adicione uma rota GET para "/users/:userId" que envie o usuário correspondente ao userId fornecido na URL
app.get("/users/:userId", (req, res) => {
  const userId = req.params.userId;

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }
  res.json(user);
});

// Exercício 5: Query Parameters
// 1. Objetivo: Aprender a usar parâmetros de consulta e testar APIs usando Postman.
// 2. Instruções:
// Adicione uma rota GET para "/search" que aceite um parâmetro de consulta keyword para filtrar as playlists por nome.
app.get("/search", (req, res) => {
  const keyword = req.query.keyword?.toString();

  if (!keyword) {
    return res.status(400).json({ error: "Playlist não encontrada!" });
  }

  const playlistsEncontradas = [];

  for (const user of users) {
    for (const playlist of user.playlists) {
      if (playlist.name.toLowerCase().includes(keyword.toLowerCase())) {
        playlistsEncontradas.push({
          userId: user.id,
          playlistId: playlist.id,
          playlistName: playlist.name,
        });
      }
    }
  }

  res.json(playlistsEncontradas);
});

// Exercício 6.1: Criação Básica de Playlist (Método POST)
// 1. Objetivo: Aprender a usar o método POST para criar novos recursos.
// 2. Instruções:
// Adicione uma rota POST para "/users/:userId/playlists" que permita adicionar uma nova playlist ao usuário especificado.
// Nesta etapa, não se preocupe com validações. Apenas insira a nova playlist no array de playlists do usuário.

//   Exercício 6.2: Validação de Dados na Criação de Playlist
// 1. Objetivo: Adicionar validações ao método POST.
// 2. Instruções:
// Modifique a rota POST do exercício anterior para verificar se todos os campos necessários estão presentes no corpo da
// solicitação.
// Se algum campo estiver faltando, retorne um código de status 400 (Bad Request).

// Exercício 6.3: Utilizando Códigos de Status HTTP Corretos
// 1. Objetivo: Aprender a usar códigos de status HTTP apropriados.
// 2. Instruções:
// Se a criação da playlist for bem-sucedida, retorne um código de status 201 (Created).
// Se o userId fornecido na URL não existir, retorne um código de status 404 (Not Found).
app.post("/users/:userId/playlists", (req, res) => {
  const userId = req.params.userId;
  const { name, tracks } = req.body;

  // Verifique se todos os campos obrigatórios estão presentes
  if (!userId || !name || !tracks) {
    return res
      .status(400)
      .json({
        error: "Todos os campos são obrigatórios: userId, name e tracks.",
      });
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado!" });
  }

  const newPlaylist = {
    id: uuidv4(),
    name,
    tracks,
  };

  user.playlists.push(newPlaylist);

  res
    .status(201)
    .json({
      message: "Sua solicitação POST foi recebida com sucesso!",
      newPlaylist,
    });
});

// Exercício 7.1: Atualizando uma Playlist (Método PUT)
// 1. Objetivo: Aprender a usar o método PUT para atualizar recursos existentes.
// 2. Instruções:
// Adicione uma rota PUT para "/users/:userId/playlists/:playlistId" que permita atualizar o nome de uma playlist existente.
// Nesta etapa, não se preocupe com validações

// Exercício 7.2: Validação e Códigos de Status na Atualização
// 1. Objetivo: Adicionar validações e usar códigos de status HTTP corretos ao atualizar uma playlist.
// 2. Instruções:
// Modifique a rota PUT para verificar se o nome da playlist está presente no corpo da solicitação. Se estiver faltando, retorne
// um código de status 400 (Bad Request).
// Se o userId ou playlistId fornecidos na URL não existirem, retorne um código de status 404 (Not Found)
app.put("/users/:userId/playlist/:playlistId", (req, res) => {
  const userId = req.params.userId;
  const playlistId = req.params.playlistId;
  const newName = req.body.name;

  if(!newName) {
    return res.status(400).json({ error: 'Informe o nome da playlist!'})
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado!" });
  }

  const playlist = user.playlists.find(
    (playlist) => playlist.id === playlistId
  );

  if (!playlist) {
    return res.status(404).json({ error: "Playlist não encontrada!" });
  }

  playlist.name = newName;

  res.status(200).json({ message: 'Nome da playlist atualizado com sucesso!', playlist });

});

// Exercício 8: Deletando uma Playlist (Método DELETE)
// 1. Objetivo: Aprender a usar o método DELETE para remover recursos.
// 2. Instruções:
// Adicione uma rota DELETE para "/users/:userId/playlists/:playlistId" para remover uma playlist existente.
// Se o userId ou playlistId fornecidos na URL não existirem, retorne um código de status 404 (Not Found)
app.delete('/users/:userId/playlists/:playlistId', (req, res) => {
    const userId = req.params.userId;
    const playlistId = req.params.playlistId;
  
    const user = users.find((user) => user.id === userId);
  
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
  
    const playlistIndex = user.playlists.findIndex((playlist) => playlist.id === playlistId);
  
    if (playlistIndex === -1) {
      return res.status(404).json({ error: 'Playlist não encontrada!' });
    }
  
    user.playlists.splice(playlistIndex, 1);
  
    res.status(204).json({ message: 'Playlist Deletada com Sucesso!'});
  });

app.listen(3003, () => {
  console.log("Server is running in http://localhost:3003");
});
