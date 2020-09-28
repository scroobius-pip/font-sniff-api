const isDev = !process.env.AWS_REGION;
import getFontInfo from '../getFontInfo'

module.exports = async (req, res) => {
    const url = req.query?.url
    if (!url) {
        return res.json({
            error: 'No Url Specified'
        })
    }
    const fontInfo = await getFontInfo(url, isDev)
    return res.json({
        ...fontInfo,
        error: ''
    })


}