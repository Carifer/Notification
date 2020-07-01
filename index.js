const Koa = require('koa');
const router = require('koa-router');
const body = require('koa-body');
const Pug = require('koa-pug');
const serve = require('koa-static');
const webpush = require('web-push');
const path = require('path');

require('dotenv').config();

'use strict';

// -- CONFIGURACION DEL WEB PUSH -- //
//const vapidKeys = webpush.generateVAPIDKeys();
//console.log(vapidKeys);

const vapidKeys = {
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY
};

webpush.setVapidDetails(
    'mailto:carifer411@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// -- CONFIGURACION KOA -- //

const app = new Koa(); // 1

app.use(body()); // 2

const pug = new Pug({ // 3
    viewPath: path.resolve(__dirname, './views'),
    basedir: './views',
    app: app
})

app.use(serve('assets')); // 4

// -- RUTAS APLICACION EN KOA --//

const _ = router();

// - GET - //

_.get('/', async ctx => {
    return ctx.render('index');
});

const clientList = [];

// - POST - //

_.post('/subscribe', async ctx => {
    const  sub   = JSON.parse(ctx.request.body);
    try {
        //console.log(sub);
        clientList.push(sub);
    } catch (e){
        console.log(e);
    }

    ctx.body = 'ok';
});

// - POST. Envio de Notificación - //

_.post('/', async ctx => {
    const {title,body} = ctx.request.body;

    try {
        clientList.forEach(subItem => {
            //var item = JSON.parse(subItem);
            //console.log(subItem);
            webpush.sendNotification(subItem.sub, JSON.stringify({title, body}));
        });
    } catch (e){
        console.log(e);
    }

    return ctx.render('index');    
});

app.use(_.routes());

app.listen(4444,() => {
    console.log('listen: ' + 4444);
});

