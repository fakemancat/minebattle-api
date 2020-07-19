<h1 align="center">minebattle-api</h1>
<p align="center">
NodeJS библиотека для работы с API сервиса "Битва шахтёров"
<br><br>
<img src="https://img.shields.io/github/stars/fakemancat/minebattle-api?style=for-the-badge" alt="stars"></img>
<img src="https://img.shields.io/github/forks/fakemancat/minebattle-api?style=for-the-badge" alt="forks"></img>
<img src="https://img.shields.io/github/issues/fakemancat/minebattle-api?style=for-the-badge" alt="forks"></img>
<a href="https://www.npmjs.com/package/minebattle-api"><img src="https://img.shields.io/npm/v/minebattle-api.svg?style=for-the-badge" alt="Version"></a>
<a href="https://www.npmjs.com/package/minebattle-api"><img src="https://img.shields.io/npm/dt/minebattle-api.svg?style=for-the-badge" alt="Downloads"></a>
</p>

## Установка

*yarn*
```bash
yarn add minebattle-api
```

*npm*
```bash
npm i -S minebattle-api
```

## Подключение
```js
const { MineBattle } = require('minebattle-api');

const mb = new MineBattle(token);
```

## Методы API
**call** - Универсальный метод отправки запроса

|Параметр|Тип|Обязателен|Описание|
|-|-|-|-|
|methodName|string|Да|Имя метода|
|params|object|Нет|Параметры метода|

Пример:
```js
async function run() {
    const user = await mb.call('user.get', {
        user_id: 236908027
    });

    console.log(user);
}

run().catch(console.error);
```

#

**getUserInfo** - Получить информацию о пользователе

|Параметр|Тип|Обязателен|Описание|
|-|-|-|-|
|userId|number|Да|Айди пользователя|

Пример:
```js
async function run() {
    const user = await mb.getUserInfo(236908027);

    console.log(user);
}

run().catch(console.error);
```

#

**getMerchantInfo** - Получить информацию о данном мерчанте

Пример:
```js
async function run() {
    const merchant = await mb.getMerchantInfo();

    console.log(merchant);
}

run().catch(console.error);
```

#

**editMerchantInfo** - Обновить информацию мерчанта

|Параметр|Тип|Обязателен|Описание|
|-|-|-|-|
|params|object|Да|Новая информация мерчанта|
|params.avatar|string|Нет|Прямая ссылка на новый аватар мерчанта|
|params.name|string|Нет|Новое имя для мерчанта|
|params.group_id|number|Нет|Новая группа для мерчанта|

*- Как минимум один из параметров должен присутствовать.

*- params.avatar обязательно должен быть .png

Пример:
```js
async function run() {
    const merchant = await mb.editMerchantInfo({
        name: 'My awesome shop'
    });

    console.log(merchant);
}

run().catch(console.error);
```

#

**createBill** - Выставить счёт пользователю

|Параметр|Тип|Обязателен|Описание|
|-|-|-|-|
|targetId|number|Да|Айди пользователя, которому нужно выставить счёт|
|amount|number|Да|Количество запрашиваемых монет|

Пример:
```js
async function run() {
    const response = await mb.createBill(236908027, 123);

    console.log(response);
}

run().catch(console.error);
```

#

**sendPayment** - Сделать перевод пользователю

|Параметр|Тип|Обязателен|Описание|
|-|-|-|-|
|targetId|number|Да|Айди пользователя, которому нужно сделать перевод|
|amount|number|Да|Количество отправляемых монет|

Пример:
```js
async function run() {
    const response = await mb.sendPayment(236908027, 123);

    console.log(response);
}

run().catch(console.error);
```

#

**setWebhook** - Обновить вебхук для мерчанта

|Параметр|Тип|Обязателен|Описание|
|-|-|-|-|
|url|string|Да|Прямая ссылка на вебхук|

Пример:
```js
async function run() {
    const response = await mb.setWebhook('https://my-awesome-domain.ru/payment');

    console.log(response);
}

run().catch(console.error);
```

## Получение платежей

Получение новых платежей происходит по методу Webhook. Перед использованием этого метода, обязательно нужно зарегистрировать свой хук, с помощью метода **setWebhook**

#

**startWebhook** - Запустить вебхук

|Параметр|Тип|Обязателен|Описание|
|-|-|-|-|
|path|string|Да|Путь хука, например '/payment'|
|port|number|Да|Порт, на котором будет запущен хук|

**onPayment** - Подписаться на события новых входящих платежей

|Параметр|Тип|Обязателен|Описание|
|-|-|-|-|
|callback|Function|Да|Функция обратного вызова, для приёма платежей|

**callback** - Возвращает данные о новом входящем платеже

|Параметр|Тип|Описание|
|-|-|-|
|amount|number|Количество монет|
|from_id|number|Айди отправителя|
|updated_merchant_balance|number|Новый баланс данного мерчанта|
|updated_user_balance|number|Новый баланс отправителя|

Пример:
```js
mb.setWebhook('https://my-awesome-domain.ru:8181/payment').then(() => {
    mb.startWebhook('/payment', 8181);

    mb.onPayment((payment) => {
        const {
            amount, from_id,
            updated_merchant_balance,
            updated_user_balance
        } = payment;
    });
});
```