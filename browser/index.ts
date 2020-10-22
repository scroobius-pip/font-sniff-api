import { launch, Page, connect } from 'puppeteer-core'
import { getOptions } from './options'
const apiKey = process.env?.BROWSERLESS_KEY
const startupFlags = ['--disable-web-security', '--no-sandbox']


export default async (isDev: boolean) => {
    try {


        const browser = await connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${apiKey}&blockAds&--disable-web-security&--no-sandbox`,

        })

        return browser
    } catch (error) {
        console.log('Could not get browser')
        throw 'Could not get browser'
    }
}