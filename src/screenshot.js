const matchDimensions = {
    scene: {
        width: 1200,
        height: 630
    },
    'mobile-scene': {
        width: 720,
        height: 1280
    }
}
module.exports = (browser, port) => (id, scene ='scene') => {
    return new Promise(async (resolve) => {
    const page = await browser.newPage()
    page.setViewport(matchDimensions[scene])
    // page
    //     .on('console', message =>
    //         console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))

    await page.exposeFunction('onSceneRender', async () => {
        const data = await page.screenshot({encoding: 'base64', type: 'png'})
        resolve(data)
        await page.close()
    });
    await page.goto(`http://localhost:${port}/${id}/${scene}`)
    })
}
