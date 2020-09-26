import opentype from 'simdi-opentype.js'
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


export default async (fontUrl: string, text: string): Promise<string> => {
    try {

        const font = await opentype.load(fontUrl)

        const path = font.getPath(text, 0, 0, 35)
        const svg = path.toSVG(2)
        return `<svg viewBox="0 0 500 500"  xmlns="http://www.w3.org/2000/svg">${svg}</svg>`
    } catch (error) {
        console.error('Could not get svg')
        return ''
    } finally {

    }

}