const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '5663353112:AAExjnra8YMGZzhVxsIwIpneMHddajwNlh0';

const bot = new TelegramApi(token, { polling: true })

const chats = {}



const startGame = async (chatId) => {
	await bot.sendMessage(chatId, 'Сейчас я загадаю цирфу от 0 до 10, попробуй её отгадать!');
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, 'Отгадай это число', gameOptions)
}


const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное приветствие' },
		{ command: '/info', description: 'Получить информацию о пользователе' },
		{ command: '/game', description: 'Игра угадай цифру' },
	])

	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id


		if (text === '/start') {
			await bot.sendMessage(chatId, 'https://chpic.su/_data/stickers/y/yori_vk/yori_vk_014.webp');
			return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот`);
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
		}
		if (text === '/game') {
			return startGame(chatId);
		}
		return bot.sendMessage(chatId, 'Я тебя не понимаю, давай ещё раз')
	})

	bot.on('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data == '/again') {
			return startGame(chatId);
		}
		if (data === chats[chatId]) {
			return bot.sendMessage(chatId, `Ты отгадал, это цифра ${chats[chatId]}`, againOptions)
		} else {
			return bot.sendMessage(chatId, `Попробуй ещё раз, это была цифра ${chats[chatId]}`, againOptions)
		}
	})
}

start()