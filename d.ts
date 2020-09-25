import getBrowser from './browser'
import getFontInfo from './getFontInfo';
const isDev = !process.env.AWS_REGION;

(async () => {

    const browser = await getBrowser(isDev)
    await browser.goto('https://relate.app/');

    const data = await browser.evaluate(() => {

        const fontMap = new Map<string, string[]>()

        const nodes = Array.from(window.document.getElementsByTagName('*'))
        const pseudoElements = ['', ':before', ':after']

        nodes.forEach(node => {
            pseudoElements.forEach(pseudo => {
                const { fontFamily, fontWeight } = window.getComputedStyle(node, pseudo)
                console.log(fontFamily)
                if (!fontFamily) return null

                fontFamily.split(/\n*,\n*/g).forEach(font => {
                    const fontName = font.replace(/^\s*['"]([^'"]*)['"]\s*$/, '$1').trim()
                    if (fontMap.has(fontName)) {
                        fontMap.set(fontName, [...fontMap.get(fontName), fontWeight])
                    } else {
                        fontMap.set(fontName, [fontWeight])
                    }
                })



            })

        })

        return fontMap



    });

    console.log(data)

    await browser.close()

})()