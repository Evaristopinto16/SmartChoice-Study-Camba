import TelegramBot from 'node-telegram-bot-api' 
import RaciocionioInteligenteAplicandoRAG from "./api.js" 


// Substitua pelo token do seu bot
const token = '8041186463:AAFrDDqp4Lu9BjAUqfuXv7CO3mWftJrYORM';

// Crie um bot que usa 'polling' para receber atualizações RaciocionioInteligenteAplicandoRAG("eu gosto muito de aprender sobre turismo  e tenciono cursar o ensino superior na area ")
const bot = new TelegramBot(token, {polling: true});

// Responder a mensagens de texto
bot.on('message', async (msg) => {
    
  const chatId = msg.chat.id;
  const text = msg.text;
  console.log(chatId, text)

  console.log(`Mensagem recebida: ${text}`);

  // Responder de volta
  if (text.toLowerCase() === 'oi' || text.toLowerCase() === 'olá') {
    bot.sendMessage(chatId, 'Olá! Como posso ajudar?');
  } else if (text.toLowerCase() === 'sms') {
    bot.sendMessage(chatId, 'Esta é uma resposta simulada para SMS.');
  } else {
    let x = await RaciocionioInteligenteAplicandoRAG(text)
    bot.sendMessage(chatId, 'Recebi sua mensagem: ' + x);
  }
});

console.log('Bot está rodando...');