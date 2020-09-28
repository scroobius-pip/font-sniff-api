const isDev = !process.env.AWS_REGION;
import getFontInfo from '../getFontInfo'
const normalizeUrl = require('normalize-url');

module.exports = async (req, res) => {
    try {
        const url = req.query?.url
        if (!url) {
            return res.json({
                error: 'No Url Specified'
            })
        }
        const fontInfo = await getFontInfo(normalizeUrl(url), isDev)
        return res.json({
            ...fontInfo,
            error: ''
        })

    } catch (error) {
        console.error(error)
        return res.json({
            error: "There was an issue getting this website's fonts."
        })
    }

}