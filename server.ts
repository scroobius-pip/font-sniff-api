import fastify from 'fastify';
import * as normalizeUrl from 'normalize-url';
import getFontInfo from './getFontInfo';
// import { api } from './api'
const app = fastify({ logger: true })

const isDev = !!process.env?.DEV

app.get('/', async (req, res) => {


    try {
        const url = (req as any).query?.url
        if (!url) {

            return {
                error: 'No Url Specified'
            }
        }
        const fontInfo = await getFontInfo(normalizeUrl(url), isDev)
        res.header('Cache-Control', 's-maxage=86400, stale-while-revalidate')
        return ({
            ...fontInfo,
            error: ''
        })

    } catch (error) {
        console.error(error)
        return ({
            error: "There was an issue getting this website's fonts."
        })
    }

})

const start = async () => {
    try {
        const PORT = +process.env?.PORT ?? 3000
        await app.listen(PORT)
        app.log.info(`server listening on ${(app as any).server.address().port}`)

    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()