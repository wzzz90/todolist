const Koa = require('koa');
const Router = require('koa-router');
// const Swig = require('koa-swig');
// const co = require('co');
const koaStaticCache = require('koa-static-cache');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const app = new Koa();

app.use(koaStaticCache(__dirname + '/static', {
    prefix: '/static',
    gzip: true
}))

app.use(bodyParser())

let datas = JSON.parse(fs.readFileSync('./static/data.json'))
const router = new Router();

router.get('/todos', (ctx, next) => {
    ctx.body = {
        code: 200,
        data: datas.todos,
        msg: '成功',
        status: true
    }
})

router.post('/addTodo', async(ctx, next) => {
    let val = ctx.request.body.newTask;
    
    datas.todos.push({
        id: datas.todos.length+1,
        title: val,
        done: false
    })
    ctx.body = {
        code: 200,
        data: datas.todos,
        msg: '成功',
        status: true
    }

    fs.writeFileSync('./static/data.json', JSON.stringify(datas))
    
})

router.post('/editTodos', async(ctx, next) => {
    let id = ctx.request.body.id;
    if(!!id) {
        datas.todos.forEach(todo => {
            if(todo.id == id) {
                todo.done = !todo.done
            }
        })
        ctx.body = {
            code: 200,
            data: datas.todos,
            msg: '成功',
            status: true
        }
        fs.writeFileSync('./static/data.json', JSON.stringify(datas))
    } else {
        ctx.body = {
            code: 100,
            data: '',
            msg: '参数错误',
            status: false 
        }
    }
})

router.post('/delTodo', (ctx, next) => {
    let id = ctx.request.body.id;
    if(!!id) {
       datas.todos = datas.todos.filter(todo => todo.id != id)
        ctx.body = {
            code: 200,
            data: datas.todos,
            msg: '成功',
            status: true
        }
        fs.writeFileSync('./static/data.json', JSON.stringify(datas))
    } else {
        ctx.body = {
            code: 100,
            data: '',
            msg: '参数错误',
            status: false 
        }
    }    
})

app.use(router.routes())

app.listen(8081)