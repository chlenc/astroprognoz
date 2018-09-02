const TelegramBot = require('node-telegram-bot-api');
const token =/* "459914749:AAE38mka1v9hyxYk1l2aihXBN05lRlM0Oi8";*/"502100941:AAETwKMomDTjDGaJsKLIcNZnbzXH93fTrTo";
var schedule = require('node-schedule');

const bot = new TelegramBot(token, {polling:true});

const helpers = require('./helpers');
const keyboards = require('./keyboard');
const kb = require('./keyboard-buttons');
const frases = require('./frases');

const rule = new schedule.RecurrenceRule();
rule.minute = 1;

schedule.scheduleJob(rule, function(){
    helpers.trigger(bot)
});

bot.on('message', (msg) => {
    // console.log(msg)
    const chatId = msg.chat.id;
    const text = msg.text;

    if ((text == 'Да, у меня московское время')) {
        helpers.setTimezone(msg, 0)
        helpers.whenAsk(bot, chatId);

    }
    else if (text === 'Нет, у меня не московское время') {
        helpers.chooseTimezone(bot, chatId)
    }
    else if (helpers.isTimezoneValue(text) !== false) {
        helpers.setTimezone(msg, helpers.isTimezoneValue(text));
        helpers.whenAsk(bot, chatId);
    }
    else if ((text == 'Заранее')) {
        helpers.updateData(("users/" + chatId), {beforehand: true});
        helpers.beforehandMes(bot, chatId);
    }
    else if ((text == 'В день прогноза')) {
        helpers.updateData(("users/" + chatId), {beforehand: false});
        helpers.in_a_day(bot, chatId);
    }
    else if (helpers.checkForTimes(text)) {
        helpers.setForecastTime(bot, chatId, text)
    }
    else if ((text == 'Узнать прогноз на сегодня')) {
        helpers.todayForecast(bot, chatId)
    }
    else if ((text == '⚙Настройки️')) {
        helpers.moscowAsk(bot, chatId, msg.chat.first_name);
    }
    else if ((text == 'Узнать прогноз на завтра')) {
        helpers.tomorrowForecast(bot, chatId)
    }
    else if ((text == '🔗Поделиться' || text == '🔗 Поделиться прогнозом')) {
        helpers.getTodayForecast(function (callback) {
            bot.sendMessage(chatId, 'Поделитесь с другом прогнозом на сегодня', {
                reply_markup: {
                    inline_keyboard: [[{
                        text: 'Поделиться прогнозом',
                        switch_inline_query: '\n\n' + callback
                    }]]
                }
            })
        })
    }
    else if ((text == '⚡️Как это работает?')) {
        bot.sendMessage(chatId, frases.howText);
    }
    else if ((text == '💇🏻Запланировать стрижку')) {
        helpers.sendAdvice(bot, chatId, 2, frases.hairCut);
    }
    else if ((text == '🚀Лучший день для начинаний')) {
        helpers.sendAdvice(bot, chatId, 4, frases.bestStartDay);
    }
    else if ((text == '🛠Уборка, домашние дела')) {
        helpers.sendAdvice(bot, chatId, 8, frases.cleanDay);
    }
    else if ((text == '🎯Удачный день для бизнеса')) {
        helpers.sendAdvice(bot, chatId, 6, frases.buisnessDay);
    }

});

bot.on('callback_query', query => {
    // console.log(query.data)

    const {chat, message_id, text} = query.message;
    try{
        var parseQuery = JSON.parse(query.data);
        // if(parseQuery.type === 'advice'){
            helpers.getAdviceDetalization(parseQuery.num,parseQuery.date,function(callback){
                bot.sendMessage(chat.id, callback + '\n\n' + frases.goToHome);
            });
        // }
    }catch(e){
        console.log(e)
    }
})

bot.onText(/\/start/, msg => {
    helpers.sendAstroForecast(bot, msg.chat.id, new Date())
    setTimeout(function () {
        helpers.moscowAsk(bot, msg.chat.id, msg.chat.first_name)
    }, 1000);
});

bot.onText(/\/home/, msg => {
    helpers.home(bot, msg.chat.id)
});

bot.onText(/\/help/, msg => {
    bot.sendMessage(msg.chat.id,frases.help)
});

bot.onText(/\/about/, msg => {
    bot.sendMessage(msg.chat.id,frases.about)
});

bot.onText(/\/echo/, msg => {
     gs.getData(function (callback) {
         console.log(callback)
     })
    console.log('end')
});


console.log('Bot has been started ....');

/*1. Меняем кнопку "отправить бота другу" на "Поделиться прогнозом" (отправляется не ссылка на бота, а пересылается сообщение)*/