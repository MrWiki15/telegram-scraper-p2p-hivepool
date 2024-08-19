const { Telegraf } = require("telegraf");

// Cargar variables de entorno
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);

const channelId = process.env.P2P_CHANEL_ID; // ID del canal
console.log(channelId);

let messages = [];

// Función para iniciar el bot y cargar mensajes en tiempo real
async function startBot() {
  bot.catch((err, ctx) => {
    console.log(`Error de polling para ${ctx.updateType}:`, err);
  });

  // Manejar mensajes en tiempo real
  bot.on("channel_post", (ctx) => {
    const msg = ctx.channelPost;
    console.log(`Recibido mensaje en el canal: ${msg.sender_chat.title}`);

    console.log(msg.chat.id);
    if (msg.chat && msg.chat.id === parseInt(channelId)) {
      // Extraer y formatear la información del mensaje
      // size = Cantidad en hive
      // taza = taza de cambio
      // atm = tipo de pago
      // c_op = operaciones terminadas
      // rp = reputacion del user

      const messageData = {
        market: "HiveCuba P2P Market",
        type: formatType(msg.text),
        size: formatCant(msg.text),
        taza: formatTaza(msg.text),
        atm: formatAtm(msg.text),
        user_info: {
          c_op: formatCOp(msg.text),
          rp: formatRp(msg.text),
        },
        date: new Date(msg.date * 1000),
      };
    }
  });

  bot.launch();
  console.log("Bot encendido y listo para recibir mensajes...");
}

// Función para obtener los mensajes almacenados
function getMessages() {
  return messages;
}

// Funciones para formatear la información

function formatType(text) {
  const match = text.match(/#(COMPRA|VENTA)/i);
  return match ? match[1].toUpperCase() : "DESCONOCIDO";
}

function formatCant(text) {
  const match = text.match(/💰\s+(\d+(\.\d+)?)\s+#HBD/i);
  return match ? parseFloat(match[1]) : 0;
}

function formatTaza(text) {
  const match = text.match(/💹\s+Tasa de cambio:\s+([\d,\.]+)/i);
  return match ? parseFloat(match[1].replace(",", "")) : 0;
}

function formatAtm(text) {
  const match = text.match(/🏧\s+Medio de pago:\s+([^\n]+)/i);
  return match ? match[1].trim() : "DESCONOCIDO";
}

function formatCOp(text) {
  const match = text.match(/🔁\s+Operaciones terminadas:\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

function formatRp(text) {
  const match = text.match(/🎖\s+Reputación en HIVE:\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

module.exports = { startBot, getMessages };
