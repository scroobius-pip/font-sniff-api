import { launch, Page, connect } from 'puppeteer-core'
import { getOptions } from './options'

const startupFlags = ['--disable-web-security', '--no-sandbox']


export default async (isDev: boolean) => {
    const browser = await connect({
        browserWSEndpoint: `wss://chrome.headlesstesting.com?token=12DC153B3DC3FB37D2&startupFlags=${JSON.stringify(startupFlags)}`,

    })

    return browser

}