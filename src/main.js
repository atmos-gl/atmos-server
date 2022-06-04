const express = require('express')
const puppeteer = require('puppeteer')
const NodeCache = require('node-cache')
const cors = require('cors')
const bodyParser = require('express')
const {createUser, getUser} = require('./shareManager')
const screenshot = require('./screenshot')
const path = require('path')
const app = express()
const port = 1556

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

// set the view engine to ejs
app.set('views', path.resolve('./views'));
app.set('view engine', 'ejs');

let browser, takeScreenshot
const cache = new NodeCache()

const cacheScreenShot = async (id) => {
    const data = await takeScreenshot(id)
    cache.set(id, data)
    return data
}

app.post('/new', (req, res) => {
    const {username, sceneData} = req.body
    if (!username || !sceneData) {
        res.status(400).end('Missing username')
        return
    }
    const newUser = createUser(username, sceneData)
    cacheScreenShot(newUser.id)
    res.end(newUser.id)
})

app.get('/:id', (req, res) => {
    const {id} = req.params
    const user = getUser(id)
    if (!user) {
        res.status(404).end('User not found')
        return
    }
    return res.render('index', user)
})
app.get('/:id/scene', (req, res) => {
    const {id} = req.params
    const user = getUser(id)
    if (!user) {
        res.status(404).end('share not found')
        return
    }
    return res.render('scene', user)
})
app.get('/:id/image.png', async (req, res) => {
    const {id} = req.params
    let data = cache.get(id)
    if (!data) {
        data = await cacheScreenShot(id)
    }
    res.contentType('image/png');
    res.end(data, 'base64');
})
app.get('/:id/download', async (req, res) => {
    const {id} = req.params
    res.download(`https://share.atmos-serre.com/${id}/image.png`)
})
const init = async () => {
    browser = await puppeteer.launch()
    takeScreenshot = screenshot(browser, port)
    console.log('launched puppeteer')

    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
}
init()
