const express = require('express')
const puppeteer = require('puppeteer')
const NodeCache = require('node-cache')
const app = express()
const port = 1556

app.use(express.static('public'))

const testCache = new NodeCache()

// app.post()
let browser

app.get('/screenshot.png', async (req, res) => {
    const page = await browser.newPage()
    // page
    //     .on('console', message =>
    //         console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))

    await page.exposeFunction('onSceneRender', async () => {
        const data = await page.screenshot({ encoding : 'base64', type: 'png' } )

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
