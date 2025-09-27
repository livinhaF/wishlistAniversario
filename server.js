// carrega as variáveis que estão no .env (como a URI do banco)
require('dotenv').config();

// importa os pacotes principais
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// inicializa a aplicação express
const app = express();

// conecta no MongoDB usando a URI que veio do .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar:', err));

// importa o modelo que define como a mensagem vai ser salva
const Message = require('./models/message');

// middlewares: ajudam a lidar com os dados que chegam e com os arquivos estáticos
app.use(express.json()); // permite receber dados em JSON no corpo da requisição
app.use(express.static(path.join(__dirname, 'public'))); // libera a pasta public pro navegador acessar

// rota para salvar nova mensagem no banco
app.post('/mensagens', async (req, res) => {
    try {
        console.log(req.body); // só pra acompanhar o que chegou
        const novaMensagem = new Message({
            nome: req.body.nome || 'Anônimo', // se não mandar nome, vira "Anônimo"
            conteudo: req.body.conteudo
        });
        await novaMensagem.save(); // salva no banco
        res.status(201).json({
            message: 'Mensagem salva com sucesso!',
            id: novaMensagem._id // devolve o id da mensagem criada
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao salvar mensagem' }); // devolve erro se der ruim
    }
});

// rota para listar as últimas 10 mensagens (ordem decrescente de criação)
app.get('/mensagens', async (req, res) => {
    const mensagens = await Message.find().sort({ createdAt: -1 }).limit(10);
    res.json(mensagens);
});

// inicia o servidor na porta 3000 ou vercel
const PORT = process.env.PORT || 3000; // Usa a porta do ambiente (Vercel) ou 3000 (Local)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});