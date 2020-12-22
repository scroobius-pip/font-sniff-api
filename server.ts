import fastify from 'fastify';
import * as normalizeUrl from 'normalize-url';
import getFontInfo from './getFontInfo';
require('dotenv').config()

// import { api } from './api'
const app = fastify({ logger: true })
import getBrowser from './browser';

const isDev = !!process.env?.DEV
app.register(require('fastify-cors'))


app.get('/', async (req, res) => {

    const browser = await getBrowser();

    try {
        const url = (req as any).query?.url
        if (!url) {

            return {
                error: 'No Url Specified'
            }
        }

        const { fontInfo, count } = await getFontInfo(normalizeUrl(url, { forceHttp: true, stripWWW: false }), isDev, browser)
        // res.header('Cache-Control', 's-maxage=86400, stale-while-revalidate=1400', 'max-age=86400')
        res.headers({
            'Cache-Control': 'public, s-maxage=259200, max-age=259200, stale-while-revalidate=1400, stale-if-error=259200',
        })
        return ({
            fontInfo,
            count,
            error: ''
        })

    } catch (error) {
        console.error(error)
        res.status(500)
        return ({
            error: "There was an issue getting this website's fonts."
        })
    } finally {
        if (browser) {
            browser.close()
        }

    }

})

const start = async () => {
    try {
        const PORT = +process.env?.PORT ?? 3000
        await app.listen(PORT, '0.0.0.0')
        app.log.info(`server listening on ${(app as any).server.address().port}`)

    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()