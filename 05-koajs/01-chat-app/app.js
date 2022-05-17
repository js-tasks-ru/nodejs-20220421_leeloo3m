const path = require('path');
const Koa = require('koa');
const app = new Koa();
const Events = require('events');
// я так понимаю - нужно два роутера завязать друг на друга. Создать длинные опросы. Get запрос должен подвисать до тех пор пока не придет Post запрос. 
// 1. запрос пришел на сервер. get запрос. 
// 2. Сервер не закрывает соединение, пока у него не возникнет сообщение для отсылки. ждем событие 'message'  и когда оно возникнет - отправить тело с сообщением клиентую
// 3. Когда появляется сообщение – сервер отвечает на запрос, посылая его. Post запрос. созздаем событие 'message'.
// 4. Браузер немедленно делает новый запрос. ждем прихода нового события 'message'
// сперва пишем метод post который регистрирует событие 'message' с сообщением отправленным из чата
// в get надо сформировать тело ответа и его отправить
app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const { resolve } = require('path');
const router = new Router();
const eventEmitter = new Events();

router.get('/subscribe', async (ctx, next) => {
    ctx.body = await new Promise(resolve => eventEmitter.on('newPost', message => resolve(message)));
    ctx.status = 200;
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message;
    if(message) {
        await new Promise(resolve=> {
            resolve(eventEmitter.emit('newPost', message))
        });
    };
    ctx.status = 200;

});

app.use(router.routes());

module.exports = app;
