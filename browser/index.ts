import { connect } from 'puppeteer-core'
const apiKey = process.env?.BROWSERLESS_KEY


export default async () => {
    try {


        const browser = await connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${apiKey}&blockAds&--disable-web-security&--no-sandbox`,

        })

        return browser
    } catch (error) {
        console.error(error)
        console.log('Could not get browser')
        throw 'Could not get browser'
    }
}