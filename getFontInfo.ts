import { DOMWindow, } from 'jsdom'

type HtmlDocument = DOMWindow['document']
type HtmlElement = DOMWindow['HTMLElement']

interface FontInfo {
    family: string
    // variants: string[]
}


export default (window: Window & typeof globalThis): FontInfo[] => {
    const nodes = Array.from(window.document.getElementsByTagName('*'))
    const pseudoElements = ['', ':before', ':after']

    const fontFamily = nodes.map(node => {
        const nodeFontFamilyString = pseudoElements.map(pseudo => window.getComputedStyle(node, pseudo).fontFamily).filter(e => !!e)
        const nodeFontFamily = nodeFontFamilyString.map((s): string[] => s.split(/\n*,\n*/g))
        return nodeFontFamily.flat()
        // return nodeFontFamilyString
    }).flat()

    const uniqueFonts = [... new Set(fontFamily)]

    return uniqueFonts.map(n => ({ family: n.replace(/^\s*['"]([^'"]*)['"]\s*$/, '$1').trim() }))

}


