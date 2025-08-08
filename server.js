const express = require("express");
const { LLama} = require("@llama-node/llama-cpp");
const {Llm} = require("@llama-node/core");
const socketIo = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
 
// Configuração do Llama
 
// Caminho para o modelo GGUF (ex: "llama-3-8b-instruct.Q4_K_M.gguf")
const modelPath = "./llama-3-8b-instruct.Q4_K_M.gguf";

// Carrega o modelo (assíncrono)
Llm.load({ modelPath }).then(() => {
  console.log("Modelo carregado!");
}).catch(err => {
  console.error("Erro ao carregar modelo:", err);
});

// Rota do frontend
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket.IO para tempo real
io.on("connection", (socket) => {
  console.log("Cliente conectado!");

  socket.on("mensagem", async (data) => {
    console.log("Pergunta:", data.texto);

    try {
      // Gera a resposta (formato INST para Llama 3 Instruct)
      const resposta = await llama.createCompletion({
        prompt: `<|im_start|>user\n${data.texto}<|im_end|>\n<|im_start|>assistant\n`,
        temperature: 0.7,
        maxTokens: 500,
      });

      socket.emit("resposta", { texto: resposta.text });
    } catch (err) {
      console.error("Erro na IA:", err);
      socket.emit("resposta", { texto: "Erro ao gerar resposta." });
    }
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});