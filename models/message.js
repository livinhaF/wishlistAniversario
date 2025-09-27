const mongoose = require('mongoose');

// define o que vai ter em cada mensagem
const messageSchema = new mongoose.Schema({
  // se não mandar nome, vira "Anônimo"
  nome: {
    type: String,
    required: true,
    default: 'Anônimo'
  },
  // o texto da mensagem
  conteudo: {
    type: String,
    required: true
  },
// data de quando foi criada
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// cria o modelo pra usar no server.js
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;