import * as getUrls from 'get-urls';
import getBrowser from './browser';
import convertFontToPath from './convertFontToPath';
import convertRelativeToAbsolute from './convertRelativeToAbsolute';

type FontWeights = string[]


interface FontVariant {
    fallbacks: string[]
    weight: string;
    lineHeight: string;
    size: string;
}

interface FontData {
    fontName: string
    src: SrcObj;
    variants: Array<FontVariant>;
}

interface FontObj {
    [elementName: string]: Array<FontData>
}


type SrcObj = {
    [type in SrcTypes]: string;
};


enum SrcTypes {
    eot = 'eot',
    ttf = 'ttf',
    otf = 'otf',
    woff2 = 'woff2',
    woff = 'woff',
    other = 'other'
}





async function getFontAndSrcMaps(websiteUrl: string, isDev: boolean): Promise<FontObj> {
    const browser = await getBrowser(isDev);
    await browser.goto(websiteUrl, { timeout: 0 });

    return await browser.evaluate(() => {



        const selectFontSrc = (font: SrcObj) => {
            return font?.ttf ?? font?.otf ?? font?.eot ?? font?.woff ?? font?.woff2 ?? Object.values(font)[0];
        }

        function getSrcExtension(s: string) {
            return s.split('.').pop();
        }

        function getSrcObjName(extension: string) {
            return extension.length > 5 ? 'other' : extension;
        }

        function extractFontUrls(s: string): string[] {
            if (!s) return []

            const srcs = s.split(',');
            // return srcs
            return srcs.map(src => {
                const urls = src.match(/(?<=")(.*\.(ttf|woff2|woff|otf|eot))/g);
                if (urls) {
                    return urls;
                }
            }).filter(Boolean).flat();

        };

        function getFontSrcMap(tidyFontName: (font: string) => string, getParentPath: (url: string) => string) {
            type FontName = string
            type FontSrc = { src: any; parentPath: string; }

            const map = new Map<FontName, FontSrc>();

            const documentStylesheets = [...document.styleSheets];
            documentStylesheets.forEach(documentStylesheet => {
                const cssRules = [...documentStylesheet.cssRules];


                cssRules.forEach(cssRule => {
                    if (cssRule instanceof CSSFontFaceRule) {

                        map.set(tidyFontName(cssRule.style.fontFamily), {
                            src: ((cssRule as any).style?.src) as string,
                            parentPath: getParentPath(cssRule.parentStyleSheet.href)
                        });
                    }

                    if (cssRule instanceof CSSImportRule) {
                        const nestedStylesheet = cssRule.styleSheet;
                        const nestedCssRules = [...nestedStylesheet.cssRules];
                        nestedCssRules.forEach(rule => {
                            if (rule instanceof CSSFontFaceRule) {
                                map.set(tidyFontName(rule.style.fontFamily), {
                                    src: ((rule as any).style?.src) as string,
                                    parentPath: getParentPath(rule.parentStyleSheet.href)
                                });
                            }
                        });
                    }
                });
            });

            return map;
        }


        const initGetElementFontData = () => {
            const srcMap = getFontSrcMap(tidyFontName, getParentPath)

            return (element: Element): FontData[] => {
                type FontName = string
                const fontMap = new Map<FontName, Array<FontVariant>>();

                const getFontVariant = ({ fontWeight, lineHeight, fontSize }: CSSStyleDeclaration, fallbacks: string[]): FontVariant => ({ lineHeight, size: fontSize, weight: fontWeight, fallbacks })

                const pseudoElements = ['', ':before', ':after'];

                pseudoElements.forEach(pseudo => {

                    const elementStyle = window.getComputedStyle(element, pseudo);


                    if (!elementStyle?.fontFamily)
                        return

                    const [fontName, ...fallbacks] = elementStyle?.fontFamily.split(/\n*,\n*/g).map(tidyFontName)

                    if (fontMap.has(fontName)) {
                        fontMap.set(fontName, [...fontMap.get(fontName), getFontVariant(elementStyle, fallbacks)]);
                    } else {
                        fontMap.set(fontName, [getFontVariant(elementStyle, fallbacks)]);
                    }

                });



                return (() => {
                    const fontDatum = [] as FontData[]
                    fontMap.forEach((variants, fontName) => {
                        const { parentPath = '', src = '' } = srcMap.get(fontName)
                        const srcArray = extractFontUrls(src)
                        const srcObj = srcArray.reduce((srcObj, s) => {
                            const extension = getSrcExtension(s)
                            srcObj[getSrcObjName(extension)] = convertRelativeToAbsolute(parentPath, s)
                            return srcObj
                        }, {} as SrcObj)
                        fontDatum.push({ fontName, src: srcObj, variants })
                    })
                    return fontDatum
                })()
            }
        }


        function tidyFontName(font: string) {
            return font.replace(/^\s*['"]([^'"]*)['"]\s*$/, '$1').trim();
        }

        function getAllNodes() {
            const tagNames = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'a', 'button', 'strong',]
            return tagNames.map(t => {
                const elements = window.document.getElementsByTagName(t)
                return Array.from(elements)
            }).flat()

        }

        const getParentPath = (url: string | null) => (url ?? '').substring(0, (url ?? '').lastIndexOf("/"));

        const elements = getAllNodes();
        const getElementFontData = initGetElementFontData()

        const fontMap = elements.reduce((map, element) => {
            const fontData = getElementFontData(element)
            const elementName = element.tagName
            if (map.has(elementName)) {
                map.set(elementName, [...map.get(elementName), ...fontData])
            } else {
                map.set(elementName, fontData)
            }
            return map
        }, new Map<string, Array<FontData>>())

        return Object.fromEntries(fontMap)
    })
}

export default async (websiteUrl: string, isDev: boolean) => await getFontAndSrcMaps(websiteUrl, isDev)