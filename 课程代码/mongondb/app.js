const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const body = require('koa-better-body');
// 引入模型
const Person = require('./dbs/models/person');
const Student = require('./dbs/models/student');

const mongoose = require('mongoose');
const dbConfig = require('./dbs/config');


let router = new Router();

mongoose.connect(dbConfig.dbs, {
    useNewUrlParser: true
})

app.use(body({
    uploadDir: './static/upload'
}));

// app.use(async (ctx, next) => {
//     ctx.body = "123";
//     next();
// })

router.post('/addPerson', async (ctx) => {
    console.log(111);
    console.log(ctx.request.fields);
    const person = new Person({
        name: ctx.request.fields.name,
        age: ctx.request.fields.age
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
    console.log(ctx.request.fields.name);
    // findOne
    const result = await Person.findOne({ name: ctx.request.fields.name });
    const results = await Person.find({ name: ctx.request.fields.name });
    console.log(result);
    ctx.body = {
        result,
        results
    };
})

router.post('/updatePerson', async (ctx) => {
    const result = await Person.where({
        name: ctx.request.fields.name
    }).update({
        age: ctx.request.fields.age
    });
    ctx.body = {
        code: 0
    }
});

router.post('/delPerson', async (ctx) => {
    const result = await Person.where({
        name: ctx.request.fields.name
    }).remove();
    ctx.body = {
        code: 0
    }
})

app.use(router.routes());

app.listen(3000);

// 用命令发送请求 -d = post
// curl -d 'name=lilei&age=20' http://localhost:3000/addPerson