const express = require('express')
const puppeteer = require('puppeteer')
const NodeCache = require('node-cache')
const cors = require('cors')
const bodyParser = require('express')
const {createUser, getUser} = require('./shareManager')
const path = require('path')
const app = express()
const port = 1556

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

// set the view engine to ejs
app.set('views', path.resolve('./views'));
app.set('view engine', 'ejs');

let browser
const cache = new NodeCache()

app.post('/new', (req, res) => {
    const {username, sceneData} = req.body
    if (!username || !sceneData) {
        res.status(400).end('Missing username')
        return
    }
    const newUser = createUser(username, sceneData)
    res.end(newUser.id)
})

app.get('/:id', (req, res) => {
    const {id} = req.params
    const user = getUser(id)
    if (!user) {
        res.status(404).end('User not founs')
    }
    return res.render('index', user)
})
app.get('/:id/scene', (req, res) => {
    const {id} = req.params
    const user = getUser(id)
    if (!user) {
        res.status(404).end('share not found')
    }
    return res.render('scene', user)
})

app.get('/:id/image.png', async (req, res) => {
    const {id} = req.params
    const page = await browser.newPage()
    page.setViewport({
        width: 1920,
        height: 1080
    })
    // page
    //     .on('console', message =>
    //         console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))

    await page.exposeFunction('onSceneRender', async () => {
        const data = await page.screenshot({encoding: 'base64', type: 'png'})

        res.contentType('image/png');
        res.end(data, 'base64');
        await page.close()
    });

    await page.goto(`http://localhost:${port}/${id}/scene`)
})
const init = async () => {
    browser = await puppeteer.launch()
    console.log('launched puppeteer')

    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
}
init()
