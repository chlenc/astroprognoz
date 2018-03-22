const kb = require('./keyboard-buttons');
const frases = require('./frases');
module.exports = {
    phone: {
        reply_markup: {
            keyboard: [
                [{
                    text : 'Отправить свой номер ',
                    request_contact: true
                }]
            ]//,
            //one_time_keyboard: true
        }
    },
    home: {
        reply_markup: {
            inline_keyboard: [
                [kb.home.order],
                [kb.basket('back_to_home'),
                kb.home.action],
                [kb.feedback]
            ]
        }
    },
    back_to_home:{
        reply_markup: {
            inline_keyboard: [
                [kb.back_to_home]
            ]
        }
    },
    categories: {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: ' ✅ Вода: ',
                    callback_data: ' '
                }],
                [{
                    text: '  19 литров',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'water19'
                    })
                },
                    {
                        text: '  от 5 до 8',
                        callback_data: JSON.stringify({
                            type: 'unit',
                            unit: 'water5to8'
                        })
                    }],
                [{
                    text: '  от 0,33 до 1,5',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'water033'
                    })
                }],
                [{
                    text: ' ✅ Кулеры и помпы: ',
                    callback_data: ' '
                }],
                [{
                    text: '  Кулеры',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'coolers'
                    })
                },
                {
                    text: '  Помпы',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'pumps'
                    })
                }],
                [{
                    text: '  Стойки',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'racks'
                    })
                }, {
                    text: '  Сервис',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'service'
                    })
                }],
                [{
                    text: '  Аксессуары',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'accessories'
                    })
                }],
                //
                // [{
                //     text: ' ',
                //     callback_data: ' '
                // }],
                [{
                    text: ' ✅ Сопутствующие товары: ',
                    callback_data: ' '
                }],
                [{
                    text: '  Стаканчики',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'cups'
                    })
                },
                {
                    text: '  Тарелки',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'dishes'
                    })
                }],
                [{
                    text: '  Ложки / Вилки / Ножи',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'spoons'
                    })
                }],
                [{
                    text: '  Чай',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'tea'
                    })
                },
                {
                    text: '  Кофе',
                    callback_data: JSON.stringify({
                        type: 'unit',
                        unit: 'coffee'
                    })
                }],
                // [{
                //     text: ' ',
                //     callback_data: ' '
                // }],

                // [{
                //     text: ' ',
                //     callback_data: ' '
                // }],
                [kb.back_to_home]
            ]
        }
    }


}