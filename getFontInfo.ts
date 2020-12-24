import * as getUrls from 'get-urls';
import getBrowser from './browser';
import convertFontToPath from './convertFontToPath';
import convertRelativeToAbsolute from './convertRelativeToAbsolute';
import isequal from 'lodash.isequal'
import uniqwith from 'lodash.uniqwith'
import { Browser } from 'puppeteer-core';

type FontWeights = string[]

type FontName = string
type FontSrc = { src: any; parentPath: string; }
type SrcMap = Map<FontName, FontSrc>
interface FontVariant {

    weight: string;
    lineHeight: string;
    size: string;
}

interface FontData {
    fallbacks: string[]
    fontName: string
    src: SrcObj;
    variants: Array<FontVariant>;
}

interface ElementFontData {
    [fontName: string]: FontData;
}

interface FontObj {
    [elementName: string]: ElementFontData
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





async function getFontAndSrcMaps(websiteUrl: string, isDev: boolean, browser: Browser): Promise<{ fontInfo: FontObj, count: number }> {


    const page = await browser.newPage()

    await page.setRequestInterception(true)
    page.on('request', req => {
        ['image', 'media', 'websocket', 'manifest'].includes(req.resourceType()) ?
            req.abort()
            : req.continue()
    })
    page.on('console', consoleObj => console.log(consoleObj.text()));

    await page.goto(websiteUrl, { timeout: 0, });

    return await page.evaluate(() => {

        const convertFontVariantToString = ({ lineHeight, size, weight }: FontVariant): string => `${normalizeLineHeight(lineHeight)}|${size}|${weight}`
        const convertStringToFontVariant = (string: string): FontVariant => {
            const [lineHeight, size, weight] = string.split('|')
            return {
                lineHeight: normalizeLineHeight(lineHeight),
                size,
                weight
            }

        }

        const selectFontSrc = (font: SrcObj) => {
            return font?.ttf ?? font?.otf ?? font?.eot ?? font?.woff ?? font?.woff2 ?? Object.values(font)[0];
        }

        function inBlackList(fontName: string,): boolean {
            const blacklist = ['icon', 'slick', 'awesome', 'etmodules']
            const lowerFontName = fontName.toLowerCase()

            return blacklist.some((value) => {
                return lowerFontName.includes(value)
            })
        }

        function normalizeLineHeight(lineHeight: string): string {
            return lineHeight === 'normal' ? '1.2' : lineHeight;
        }

        function getSrcExtension(s: string) {
            return s.split('.').pop();
        }

        function getSrcObjName(extension: string) {
            return extension.length > 5 ? 'other' : extension;
        }

        function extractFontUrls(s?: string): string[] {
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

            const map = new Map() as SrcMap;

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

        function getFontNamesAndFallbacks(fontFamily: string[], srcMap: SrcMap): [string[], string, string] {
            //returns a font name, an apple version and fallbacks

            const appleFonts = ['-apple-system', 'BlinkMacSystemFont']


            const appleFont = fontFamily.filter((fontName) => appleFonts.includes(fontName))[0]
            const universalFonts = fontFamily.filter((fontName) => !appleFonts.includes(fontName))


            const chosenUniversalFont = (() => {
                for (const universalFont of universalFonts) {
                    if (srcMap.has(universalFont)) {
                        return universalFont
                    }
                }
            })()

            const fallbacks = fontFamily.filter((fontName) => ![appleFont, chosenUniversalFont].includes(fontName))

            return [
                fallbacks,
                appleFont,
                chosenUniversalFont,
            ]
        }

        const initGetElementFontData = () => {
            const srcMap = getFontSrcMap(tidyFontName, getParentPath)

            return (element: Element): ElementFontData => {
                type FontName = string
                const fontMap = new Map<FontName, Array<FontVariant>>();
                const fallbackMap = new Map<FontName, string[]>()

                const getFontVariant = ({ fontWeight, lineHeight, fontSize }: CSSStyleDeclaration): FontVariant => ({ lineHeight, size: fontSize, weight: fontWeight })

                const pseudoElements = ['', ':before', ':after'];

                pseudoElements.forEach(pseudo => {

                    const elementStyle = window.getComputedStyle(element, pseudo);


                    if (!elementStyle?.fontFamily)
                        return

                    const splitFontFamily = elementStyle?.fontFamily.split(/\n*,\n*/g).map(tidyFontName) ?? []

                    const [fallbacks, ...fontNames] = getFontNamesAndFallbacks(splitFontFamily, srcMap)


                    for (const fontName of fontNames) {
                        if (!fontName) continue

                        const fontVariantArray = fontMap.get(fontName) ?? []
                        fontVariantArray.push(getFontVariant(elementStyle))

                        if (inBlackList(fontName)) return

                        fontMap.set(fontName, fontVariantArray)
                        fallbackMap.set(fontName, [...(fallbackMap.get(fontName) ?? []), ...fallbacks])
                    }

                });



                const value = (() => {
                    let elementFontData = {} as ElementFontData

                    fontMap.forEach((variants, fontName) => {
                        const { parentPath, src } = srcMap.get(fontName) ?? { parentPath: '', src: '' }
                        const srcArray = extractFontUrls(src)
                        const srcObj = srcArray.reduce((srcObj, s) => {
                            const extension = getSrcExtension(s)
                            srcObj[getSrcObjName(extension)] = joinBaseUrl(s, parentPath ?? websiteUrl)
                            return srcObj
                        }, {} as SrcObj)




                        if (fontName in elementFontData) {
                            elementFontData = {
                                ...elementFontData,
                                [fontName]: {
                                    ...elementFontData[fontName],
                                    variants: [...elementFontData[fontName]?.variants, ...variants],
                                    src: { ...elementFontData[fontName]?.src, ...srcObj }
                                }

                            }
                            return
                        } else {
                            elementFontData = {
                                ...elementFontData,
                                [fontName]: {
                                    fallbacks: fallbackMap.get(fontName) ?? [],
                                    fontName,
                                    src: srcObj,
                                    variants
                                }
                            }
                        }
                    })
                    return elementFontData
                })()

                return value
            }
        }


        function tidyFontName(font: string) {
            const trimmed = font.replace(/^\s*['"]([^'"]*)['"]\s*$/, '$1').trim();
            return capitalizeFirstLetters(trimmed)
        }

        function capitalizeFirstLetters(font: string) {
            return font.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        }
        function joinBaseUrl(s: string, parentPath: string): any {
            try {
                return new URL(s, parentPath).href;
            } catch (error) {
                console.log(`could not join url ${s} ${parentPath}`)
                return s
            }
        }
        function getAllNodes() {
            const tagNames = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'a', 'button', 'strong',]
            return tagNames.map(t => {
                const elements = window.document.getElementsByTagName(t)
                return Array.from(elements)
            }).flat()
        }

        const getParentPath = (url: string | null) => url

        const elements = getAllNodes();
        const getElementFontData = initGetElementFontData()
        const fontNameSet = new Set<string>()
        const fontMap = elements.reduce((map, element) => {
            const elementName = element.tagName.toLowerCase()
            const mergedElementFontData = ((): ElementFontData => {
                let mergedData = {} as ElementFontData
                const fontData = getElementFontData(element)

                const currentFontData = map.get(elementName) ?? {}

                for (const fontName in fontData) {
                    fontNameSet.add(fontName)
                    if (fontName in currentFontData) {
                        mergedData = {
                            ...mergedData,
                            [fontName]: {
                                ...currentFontData[fontName],
                                fontName,
                                src: {
                                    ...currentFontData[fontName]?.src,
                                    ...fontData[fontName]?.src,
                                },
                                variants: [
                                    ...currentFontData[fontName]?.variants,
                                    ...fontData[fontName]?.variants,
                                ],
                            }
                        }
                    } else {
                        mergedData = {
                            ...mergedData,
                            [fontName]: fontData[fontName]
                        }
                    }
                }

                mergedData = { ...currentFontData, ...mergedData }

                for (const fontName in mergedData) {
                    mergedData = {
                        ...mergedData,
                        [fontName]: {
                            ...mergedData[fontName],
                            fallbacks: Array.from(new Set(mergedData[fontName].fallbacks)),
                            variants: Array.from(new Set(mergedData[fontName].variants.map(convertFontVariantToString))).map(convertStringToFontVariant)
                        }
                    }
                }



                return mergedData

            })()

            map.set(elementName, mergedElementFontData)
            return map
        }, new Map<string, ElementFontData>())
        // browser.close()
        // page.close()

        return {
            fontInfo: Object.fromEntries(fontMap),
            count: fontNameSet.size
        }
    })





}

export default async (websiteUrl: string, isDev: boolean, browser: Browser) => await getFontAndSrcMaps(websiteUrl, isDev, browser)