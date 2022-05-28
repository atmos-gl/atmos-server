const express = require('express')
const {static} = require('express')
const app = express()
const port = 1556

app.use(static('public'))

app.get('/screenshot.png', async (req, res) => {
    // const browser = await puppeteer.launch()
    // const page = await browser.newPage()
    // await page.goto(`http://localhost:${port}`)
    // const data = await page.screenshot({ encoding : 'base64', type: 'png' } )
    // console.log(data)
    // res.contentType('image/png');
    // res.end(data, 'base64');
    // await browser.close()
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
