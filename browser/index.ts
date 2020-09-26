import { launch, Page } from 'puppeteer-core'
import { getOptions } from './options'




export default async (isDev: boolean) => {
    const options = await getOptions(isDev)
    const page = await (await launch(options)).newPage()
    await page.setRequestInterception(true)
    // page.on('console', consoleObj => console.log(consoleObj.text()));

    page.on('request', req => {
        ['image', 'media', 'websocket', 'manifest'].includes(req.resourceType()) ?
            req.abort()
            : req.continue()
    })

    return page
}