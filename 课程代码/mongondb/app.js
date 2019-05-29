const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
// 引入模型
const Person = require('./dbs/models/person');

const mongoose = require('mongoose');
const dbConfig = require('./dbs/config');

let router = new Router();

mongoose.connect(dbConfig.dbs, {
    useNewUrlParser: true
})

// app.use(async (ctx, next) => {
//     ctx.body = "123";
//     next();
// })

router.post('/addPerson', async (ctx) => {
    console.log(111);
    const person = new Person({
        name: ctx.request.body.name,
        age: ctx.request.body.age
    })
    let code;
    try {
        await person.save();
        code = 0;
    } catch (e) {
        code = -1;
    };

    ctx.body = {
        code
    };
});

router.post('/getPerson', async (ctx) => {
    console.log(ctx.request.body.name);
    // findOne
    const result = await Person.findOne({ name: ctx.request.body.name });
    const results = await Person.find({ name: ctx.request.body.name });
    consle.log(result);
    ctx.body = {
        result,
        resluts
    };
})

router.post('updatePerson', async (ctx) => {
    const result = await Person.where({
        name: ctx.request.body.name
    }).update({
        age: ctx.request.body.age
    });
    ctx.body = {
        code: 0
    }
});

router.post('/delPerson', async (ctx) => {
    const result = await Person.where({
        name: ctx.request.body.name
    }).remove();
    ctx.body = {
        code: 0
    }
})

app.use(router.routes());

app.listen(3000);

// 用命令发送请求 -d = post
// curl -d 'name=lilei&age=20' http://localhost:3000/addPerson