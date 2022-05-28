const express = require('express')
const {static} = require('express')
const puppeteer = require('puppeteer')
const app = express()
const port = 1556

app.use(static('public'))

app.get('/screenshot.png', async (req, res) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    page
        .on('console', message =>
            console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    await page.goto(`http://localhost:${port}`)
    const data = await page.screenshot({ encoding : 'base64', type: 'png' } )

    res.contentType('image/png');
    res.end(data, 'base64');
    await browser.close()
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
