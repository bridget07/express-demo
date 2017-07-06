const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))
nunjucks.configure('templates', {
    autoescape: true,
    express: app
})

const messageList = []

const formatteTime = () => {
    const d = new Date()
    const h = d.getHours()
    const m = d.getMinutes()
    const s = d.getSeconds()
    const t = `${h}:${m}:${s}`
    return t
}
const log = (...args) => {
    const t = formatteTime()
    const arg = [t].concat(args)
    console.log.apply(console, arg)

    const content = t + ' ' + args + '\n'
    fs.writeFileSync('log.txt', content, {
        flag: 'a'
    })
}

app.get('/', (request, response) => {
    response.send('NIHAO, hello')
})

app.get('/message', (request, response) => {
    log('请求方法', request.method)
    log('request query 参数', request.query)
    response.render('message.html', {
        messages: messageList
    })
})

app.post('/message/add', (request, response) => {
    log('method_add请求方法', request.method)
    log('request POST 的 form 表单数据', request.body)
    const msg = {
        content: request.body.msg_post || ''
    }
    messageList.push(msg)
    response.redirect('/message')
})

const run = (port=3000, host='') => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        host = address.address
        port = address.port
        log(`listening server at http://${host}:${port}`)
    })
}

if (require.main === module) {
    const port = 4000
    const host = '0.0.0.0'
    run(port, host)
}





















