const express = require('express')
const puppeteer = require('puppeteer')
const NodeCache = require('node-cache')
const cors = require('cors')
const bodyParser = require('express')
const {createUser} = require('./shareManager')
const app = express()
const port = 1556

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

let browser
const cache = new NodeCache()

app.post('/new', (req, res) => {
    const {username} = req.body
    if (!username) {
        res.status(400).end('Missing username')
        return
    }
    const newUser = createUser(username)
    res.end(newUser.id)
})

app.get('/screenshot.png', async (req, res) => {
    const page = await browser.newPage()
    // page
    //     .on('console', message =>
    //         console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))

    await page.exposeFunction('onSceneRender', async () => {
        const data = await page.screenshot({encoding: 'base64', type: 'png'})

        res.contentType('image/png');
        res.end(data, 'base64');
        await page.close()
    });

    await page.goto(`http://localhost:${port}`)
})
const init = async () => {
    browser = await puppeteer.launch()
    console.log('launched puppeteer')

    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
}
init()
