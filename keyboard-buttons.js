

module.exports = {
    home: {
        order: {
            text: 'Сделать заказ',
            callback_data: 'order'
        },
        action: {
            text: 'Акции',
            callback_data: 'action'
        }
    },
    back_to_home: {
        text: 'Домой 🏠',
        callback_data: 'back_to_home'
    },
    back_to_categories: {
        text: 'Назад 🔙',
        callback_data: 'back_to_categories'
    },
    feedback: {
        text: 'Заказать звонок',
        callback_data: 'feedback'
    },
    basket(back) {
        return {
            text: 'Корзина 🛒',
            callback_data: JSON.stringify({
                type: 'basket',
                back: back
        })
        }
    },
    submitOrder: {
            text: 'Оформить заказ',
            callback_data: 'submitOrder'
    },
    back_to_some_category(unit) {
        return {
            text: 'Назад 🔙',
            callback_data: JSON.stringify({
                type: 'unit',
                unit: unit
            })
        }
    },
    back_to_some_unit(unit) {
        return {
            text: 'Назад 🔙',
            callback_data: JSON.stringify({
                type: 'back_to_some_category',
                unit: unit
            })
        }
    },
    plus10(unit){
        return {
            text: '+10',
            callback_data: JSON.stringify({
                type: 'plus10',
                unit:  unit
            })
        }
    },
    plus(unit){
        return {
            text: '+',
            callback_data: JSON.stringify({
                type: 'plus',
                unit:  unit
            })
        }
    },
    minus(unit){
        return {
            text: '-',
            callback_data: JSON.stringify({
                type: 'minus',
                unit:  unit
            })
        }
    },
    count(unit,c){
        return {
            text: c,
            callback_data: ' '
        }
    },
    del(unit){
        return {
            text: '🗑',
            callback_data: JSON.stringify({
                type: 'del',
                unit:  unit
            })
        }
    }

}


