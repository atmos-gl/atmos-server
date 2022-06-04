module.exports = (browser, port) => (id) => {
    return new Promise(async (resolve) => {
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
        resolve(data)
        await page.close()
    });
    await page.goto(`http://localhost:${port}/${id}/scene`)
    })
}
