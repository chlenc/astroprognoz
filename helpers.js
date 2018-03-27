const kb = require('./keyboard-buttons')
const keyboard = require('./keyboard.js');
const frases = require('./frases');
const firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "./lunar outlook-e000f7dfcf51.json",
    databaseURL: "https://lunar-outlook.firebaseio.com/"
});

/*git rm -r --cached FolderName
git commit -m "Removed folder from repository"
git push origin master*/

module.exports = {
    getTodayForecast(callback) {
        var date = dateFormat(new Date());
        try {
            firebase.database().ref('forecasts/' + date).once("value", function (snapshot) {
                var data = snapshot.val();
                if (data == null)
                    data = '';
                date = date.split('-');
                date = date[2] + '.' + date[1] + '.' + date[0] + '\n';
                callback(date + data.forecast)
            }, function (errorObject) {
                //console.log("The read failed: " + errorObject);
            });
        }
        catch (e) {
        }

    },
    sendAstroForecast(bot, id, date) {
        date = dateFormat(date);
        try {
            firebase.database().ref('forecasts/' + date).once("value", function (snapshot) {
                var data = snapshot.val();
                if (data == null)
                    data = '';
                date = date.split('-');
                date = date[2] + '.' + date[1] + '.' + date[0] + '\n';
                bot.sendMessage(id, date + data.forecast)
                // return (date+data.forecast);
            }, function (errorObject) {
                //console.log("The read failed: " + errorObject);
            });
        }
        catch (e) {
        }
    },
    moscowAsk(bot, id, name) {
        bot.sendMessage(id, ('Сейчас настроим время, когда присылать вам прогноз.\n' + name + ', у вас московское время?'), {
            reply_markup: {
                one_time_keyboard: true,
                remove_keyboard: true,
                keyboard: [
                    ['Да, у меня московское время'],
                    ['Нет, у меня не московское время']
                ]
            }
        })
    },
    chooseTimezone(bot, id) {
        bot.sendMessage(id, 'Выберите часовой пояс:', {
            reply_markup: {
                remove_keyboard: true,
                one_time_keyboard: true,
                keyboard: [
                    ['Калининградское время (МСК-1)'],
                    ['Московское время (МСК)'],
                    ['Самарское время (МСК+1)'],
                    ['Екатеринбургское время (МСК+2)'],
                    ['Омское время (МСК+3)'],
                    ['Красноярское время (МСК+4)'],
                    ['Иркутское время (МСК+5)'],
                    ['Якутское время (МСК+6)'],
                    ['Владивостокское время (МСК+7)'],
                    ['Среднеколымское время (МСК+8)'],
                    ['Камчатское время (МСК+9)']
                ]
            }
        })
    },
    setTimezone(msg, zone) {
        try {
            firebase.database().ref("users/" + msg.chat.id).once("value", function (snapshot) {
                var user = snapshot.val();
                if (user !== null)
                    var last_time_zone = user.time_zone;
                else
                    var last_time_zone = '';
                msg.chat.time_zone = zone;
                msg.chat.last_time_zone = last_time_zone;
                firebase.database().ref("users/" + msg.chat.id).update(msg.chat)
            }, function (errorObject) {
                console.log("The read failed: " + errorObject);
            });
        } catch (e) {
            // console.log(e.toString())
        }

    },
    isTimezoneValue(zone) {
        var zones = [
            'Калининградское время (МСК-1)',
            'Московское время (МСК)',
            'Самарское время (МСК+1)',
            'Екатеринбургское время (МСК+2)',
            'Омское время (МСК+3)',
            'Красноярское время (МСК+4)',
            'Иркутское время (МСК+5)',
            'Якутское время (МСК+6)',
            'Владивостокское время (МСК+7)',
            'Среднеколымское время (МСК+8)',
            'Камчатское время (МСК+9)'
        ];
        var zone = zones.indexOf(zone) - 1;
        if (zone == -2) {
            return false
        }
        else {
            return zone
        }
    },
    whenAsk(bot, id) {
        bot.sendMessage(id, 'Вам присылать прогноз заранее или в день прогноза?', {
            reply_markup: {
                one_time_keyboard: true,
                remove_keyboard: true,
                keyboard: [
                    ['Заранее'],
                    ['В день прогноза']
                ]
            }
        })

    },
    updateData(ref, data) {
        try {
            firebase.database().ref(ref).update(data)
        } catch (e) {
            console.log('update error ' + e.toString())
        }
    },
    beforehandMes(bot, id) {
        var key = [];
        for (var i = 20; i <= 22; i++) {
            key.push([{text: (i + ':00')}, {text: ((i + 1) + ':00')}])
            i++;
        }
        key.push([{text: ('24:00')}]);
        bot.sendMessage(id, 'Выберите удобное время для прогноза:', {
            reply_markup: {
                remove_keyboard: true,
                one_time_keyboard: true,
                keyboard: key
            }
        })
    },
    in_a_day(bot, id) {
        var key = [];
        for (var i = 6; i <= 13; i++) {
            key.push([{text: (i + ':00')}, {text: ((i + 1) + ':00')}])
            i++;
        }
        key.push([{text: ('14:00')}])
        bot.sendMessage(id, 'Выберите удобное время для прогноза:', {
            reply_markup: {
                remove_keyboard: true,
                one_time_keyboard: true,
                keyboard: key
            }
        })
    },
    checkForTimes(time) {
        var times = [];
        for (var i = 6; i <= 14; i++)
            times.push(i + ":00");
        for (var i = 20; i <= 24; i++)
            times.push(i + ":00");
        if (times.indexOf(time) != -1) {
            return true;
        }
        else {
            return false;
        }
    },
    setForecastTime(bot, id, text) {
        firebase.database().ref("users/" + id).once("value", function (snapshot) {
            var user = snapshot.val();
            if (user === null)
                return;
            try {
                var last_time_zone = user.last_time_zone;
                var last_time = user.time;
                last_time = +last_time.split(':')[0]; //по мск
                last_time = last_time - last_time_zone; //по мск - last_time_zone ( )
                if (last_time == 25)
                    last_time = last_time - 24;
                last_time = Math.abs(last_time)
                last_time = last_time + ':00';
                firebase.database().ref("times/" + last_time + "/" + id).remove();
            } catch (e) {
                // console.log(e.toString())
            }
            var beforehand = user.beforehand;
            var time_zone = user.time_zone;
            firebase.database().ref("users/" + id).update({time: text});
            var time = +text.split(':')[0];
            time = time - time_zone;
            if (time == 25)
                time = time - 24;
            time = Math.abs(time)
            time = time + ':00';
            firebase.database().ref("times/" + time + "/" + id).set({beforehand: beforehand, time_zone: time_zone});
            goToHome(bot, id, beforehand, "Я запомнил!=) Теперь вы будете ежедневно получать прогноз в " + text +
                ".\nИзменить время можно в настройках.\nТак же вы всегда сможете посмотреть прогноз на следующий день.");
        }, function (errorObject) {
            console.log("The read failed: " + errorObject);
        });


    },
    todayForecast(bot, chatId) {
        firebase.database().ref('users/' + chatId + '/time_zone').once("value", function (snapshot) {
            var today = new Date();
            var timezone = snapshot.val();
            today.setHours(today.getHours() + timezone);
            sendAstroForecast(bot, chatId, today, 'Вот прогноз на сегодня:\n', false)
        }, function (errorObject) {
            //console.log("The read failed: " + errorObject);
        });
    },
    tomorrowForecast(bot, chatId) {
        firebase.database().ref('users/' + chatId + '/time_zone').once("value", function (snapshot) {
            var today = new Date();
            var timezone = snapshot.val();
            today.setHours(today.getHours() + timezone);
            today.setDate(today.getDate() + 1);
            sendAstroForecast(bot, chatId, today, 'Вот прогноз на завтра:\n', true)
        }, function (errorObject) {
            //console.log("The read failed: " + errorObject);
        });
    },
    home(bot, id) {
        firebase.database().ref("users/" + id).once("value", function (snapshot) {
            var user = snapshot.val();
            if (user === null)
                return;
            var beforehand = user.beforehand;
            goToHome(bot, id, beforehand, 'Выберите действие');
        }, function (errorObject) {
            console.log("The read failed: " + errorObject);
        });
    },
    sendAdvice(bot, id, type, text) {
        firebase.database().ref('moon_calendar/').once("value", function (snapshot) {
            var data = snapshot.val();
            var reply = text + '\n';
            var date;
            var keyboard = [];
            var forward = '';
            for (var i = 0; i < 8; i++) {
                date = new Date(data[i][0]);
                date = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
                forward += (date + ' - ' + data[i][+type + 1] + '\n')
                keyboard.push([{
                    text: (date + ' - ' + data[i][+type + 1]),
                    callback_data: JSON.stringify({
                        // type: 'advice',
                        num: type,
                        date: new Date(data[i][0]).getTime()
                    })
                }])
            }
            keyboard.push([{
                text: 'Поделиться прогнозом',
                switch_inline_query: reply + forward
            }])
            bot.sendMessage(id, reply + '\n\n' + frases.goToHome, {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            });
        }, function (errorObject) {
            //console.log("The read failed: " + errorObject);
        });
    },
    getAdviceDetalization(type, time, callback) {
        firebase.database().ref("/moon_calendar").once("value", function (snapshot) {
            var data = snapshot.val();
            for (var i = 0; i < 8; i++) {
                if (new Date(data[i][0]).getTime() == new Date(time).getTime()) {
                    callback(data[i][type]);
                    break;
                }
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject);
        });
    },
    trigger(bot) {
        var date = new Date();
        var minute = "00";
        var hour = date.getHours();
        if (hour == 0)
            hour = 24;
        var time = hour + ":" + minute;
        firebase.database().ref("times/" + time).once("value", function (snapshot) {
            var users = snapshot.val();
            // console.log(users)
            // return
            // var users = {'280914417': { beforehand: true, time_zone: 0 }}

            var ides = [];
            var timezone;
            for (var temp in users) {
                try {
                    timezone = users[temp].time_zone;
                    if (users[temp].beforehand == true) {
                        date = new Date();
                        date.setHours(date.getHours() + timezone)
                        date.setDate(date.getDate() + 1);
                        sendAstroForecast(bot, temp, date, '', true)
                    }
                    if (users[temp].beforehand == false || time == '24:00') {
                        date = new Date();
                        date.setHours(date.getHours() + timezone)
                        sendAstroForecast(bot, temp, date, '', false)
                    }

                } catch (e) {}
            }

        }, function (errorObject) {
            console.log("The read failed: " + errorObject);
        });

    }

}

function sendAstroForecast(bot, id, date, text, isToday) {
    date = dateFormat(date);
    try {
        firebase.database().ref('forecasts/' + date).once("value", function (snapshot) {
            var data = snapshot.val();
            if (data == null)
                data = '';
            date = date.split('-');
            date = date[2] + '.' + date[1] + '.' + date[0] + '\n';
            bot.sendMessage(id, text + date + data.forecast + '\n\n' + frases.goToHome, getHomeKeyboard(isToday))
            // return (date+data.forecast);
        }, function (errorObject) {
            //console.log("The read failed: " + errorObject);
        });
    }
    catch (e) {
    }
}

function goToHome(bot, id, beforehand, text) {
    var keyboard = [
        ['🔗Поделиться'],
        ['💇🏻Запланировать стрижку'],
        ['🚀Лучший день для начинаний'],
        ['🛠Уборка, домашние дела'],
        ['🎯Удачный день для бизнеса'],
        //    ['Что еще умею'],
        ['⚙Настройки️', '⚡️Как это работает?']
    ];

    if (beforehand) {
        keyboard.unshift(['Узнать прогноз на сегодня']);
    } else {
        keyboard.unshift(['Узнать прогноз на завтра']);
    }

    bot.sendMessage(id, text, {
        reply_markup: {
            remove_keyboard: true,
            one_time_keyboard: true,
            keyboard: keyboard
        }
    })
}

function getHomeKeyboard(beforehand) {
    var keyboard = [
        ['🔗Поделиться'],
        ['💇🏻Запланировать стрижку'],
        ['🚀Лучший день для начинаний'],
        ['🛠Уборка, домашние дела'],
        ['🎯Удачный день для бизнеса'],
        //    ['Что еще умею'],
        ['⚙Настройки️', '⚡️Как это работает?']
    ];

    if (beforehand) {
        keyboard.unshift(['Узнать прогноз на сегодня']);
    } else {
        keyboard.unshift(['Узнать прогноз на завтра']);
    }
    return {
        reply_markup: {
            keyboard: keyboard
        }
    }
}


function dateFormat(date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}
