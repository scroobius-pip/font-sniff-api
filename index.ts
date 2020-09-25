import getBrowser from './browser'
import getFontInfo from './getFontInfo';
const isDev = !process.env.AWS_REGION;

(async () => {

    const browser = await getBrowser(isDev)
    await browser.goto('http://re-zero-anime.jp/');

    const { fontMap, fontSrcMap } = await browser.evaluate(() => {
        function tidyFontName(font: string) {
            return font.replace(/^\s*['"]([^'"]*)['"]\s*$/, '$1').trim();
        }
        const extractUrls = (s: string) => {
            const srcs = s.split(',')
            // return srcs
            return srcs.map(src => {
                const urls = src.match(/(?<=")(.*\.(ttf|woff2|woff|otf|eot))/g)
                if (urls) {
                    return urls
                }
            }).filter(Boolean).flat()

        };

        const fontMap = new Map<string, string[]>()

        const fontSrcMap = (() => {
            const map = new Map<string, { src: any[], href: string }>()


            const documentStylesheets = [...document.styleSheets]
            documentStylesheets.forEach(documentStylesheet => {
                const cssRules = [...documentStylesheet.cssRules]
                cssRules.forEach(cssRule => {
                    if (cssRule instanceof CSSFontFaceRule) {
                        map.set(tidyFontName(cssRule.style.fontFamily), { src: extractUrls((cssRule as any).style?.src), href: cssRule.parentStyleSheet.href })
                    }

                    if (cssRule instanceof CSSImportRule) {
                        const nestedStylesheet = cssRule.styleSheet
                        const nestedCssRules = [...nestedStylesheet.cssRules]
                        nestedCssRules.forEach(rule => {
                            if (rule instanceof CSSFontFaceRule) {
                                map.set(tidyFontName(rule.style.fontFamily), { src: extractUrls((rule as any).style?.src), href: rule.parentStyleSheet.href })
                            }
                        })
                    }
                })
            })

            return map
        })()



        const nodes = Array.from(window.document.getElementsByTagName('*'))
        const pseudoElements = ['', ':before', ':after']

        nodes.forEach(node => {
            pseudoElements.forEach(pseudo => {
                const { fontFamily, fontWeight } = window.getComputedStyle(node, pseudo)
                // console.log(fontFamily)
                if (!fontFamily) return null

                fontFamily.split(/\n*,\n*/g).forEach(font => {
                    const fontName = tidyFontName(font)
                    if (fontMap.has(fontName)) {
                        fontMap.set(fontName, [...fontMap.get(fontName), fontWeight])
                    } else {
                        fontMap.set(fontName, [fontWeight])
                    }
                })
            })
        })


        return { fontMap: Object.fromEntries(fontMap), fontSrcMap: Object.fromEntries(fontSrcMap) }
    });


    const result = (() => {
        let fontObj = {}
        for (const fontName in fontMap) {
            fontObj[fontName] = {
                weights: Array.from(new Set(fontMap[fontName])),
                src: (fontName in fontSrcMap) ? fontSrcMap[fontName].src : [],
                href: (fontName in fontSrcMap) ? fontSrcMap[fontName].href : ''
            }
        }

        return fontObj
    })()

    console.log(result)
    // console.log(fontSrcMap)

    await browser.close()

})()

