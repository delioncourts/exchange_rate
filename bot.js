require("dotenv").config();
const { TelegramBot } = require("node-telegram-bot-api");

// Вставь сюда токен своего бота, полученный от @BotFather
const token = process.env.BOT_TOKEN;
 
if (!token) {
  console.error("Ошибка: не найден BOT_TOKEN. Проверь файл .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

const greetings = [
  "Привет! Рад тебя видеть 👋",
  "Здравствуй! Как дела?",
  "Йо! Что нового?",
  "Приветствую тебя, путник 🌟",
  "Хэй! Классно, что ты здесь!",
];
 
function getRandomGreeting() {
  return greetings[Math.floor(Math.random() * greetings.length)];
}
 
// ^\/start$ — точное совпадение с командой, а не любое сообщение со словом "start"
bot.onText(/^\/start$/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, getRandomGreeting());
  } catch (err) {
    console.error(`Не удалось отправить сообщение в чат ${chatId}:`, err.message);
  }
});
 
// Ошибки long-polling (обрыв сети и т.п.) — без этого бот падает молча
bot.on("polling_error", (err) => {
  console.error("Ошибка polling:", err.message);
});
 
// Необработанные ошибки промисов — чтобы видеть, что пошло не так
process.on("unhandledRejection", (err) => {
  console.error("Необработанная ошибка промиса:", err);
});
 
// Корректная остановка при Ctrl+C
process.on("SIGINT", async () => {
  console.log("\nОстанавливаю бота...");
  await bot.stopPolling();
  process.exit(0);
});
 
console.log("Бот запущен...");