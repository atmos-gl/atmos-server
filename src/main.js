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

const cacheScreenShot = async (id, scene) => {
    const data = await takeScreenshot(id, scene)
    cache.set(id + '-' + scene, data)
    return data
}
const getImage = async (id, scene = 'scene') => {
    let data = cache.get(id + '-' + scene)
    if (!data) {
        data = await cacheScreenShot(id, scene)
    }
    return data
}

app.post('/new', async(req, res) => {
    const {sceneData} = req.body
    if (!sceneData) {
        res.status(400).end('Missing data')
        return
    }
    const newUser = createUser(sceneData)
    res.end(newUser.id)
    await cacheScreenShot(newUser.id, 'top-shot')
    cacheScreenShot(newUser.id, 'mobile-scene')
    cacheScreenShot(newUser.id, 'scene')
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
app.get('/:id/mobile-scene', (req, res) => {
    const {id} = req.params
    const user = getUser(id)
    if (!user) {
        res.status(404).end('share not found')
        return
    }
    return res.render('mobileScene', user)
})
app.get('/:id/top-shot', (req, res) => {
    const {id} = req.params
    const user = getUser(id)
    if (!user) {
        res.status(404).end('share not found')
        return
    }
    return res.render('topScene', user)
})
app.get('/:id/image.png', async (req, res) => {
    const {id} = req.params
    const data = await getImage(id, 'scene')
    res.contentType('image/png');
    res.end(data, 'base64');
})
app.get('/:id/mobile-image.png', async (req, res) => {
    const {id} = req.params
    const data = await getImage(id, 'mobile-scene')
    res.contentType('image/png');
    res.end(data, 'base64');
})
app.get('/:id/top-shot.webp', async (req, res) => {
    const {id} = req.params
    const data = await getImage(id, 'top-shot')
    res.contentType('image/webp');
    res.end(data, 'base64');
})
app.get('/:id/download', async (req, res) => {
    const {id} = req.params
    const user = getUser(id)
    if (!user) {
        res.status(404).end('share not found')
        return
    }
    const data = await getImage(id)
    res.writeHead(200, {
        'Content-Disposition': `attachment; filename="Panier de tomates.png"`,
        'Content-Type' : 'image/png'
    })

    const download = Buffer.from(data, 'base64')
    res.end(download)
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
