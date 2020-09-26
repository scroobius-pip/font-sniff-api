import getBrowser from './browser';
import convertFontToPath from './convertFontToPath';
import convertRelativeToAbsolute from './convertRelativeToAbsolute';

type FontWeights = string[]
interface FontMap {
    [fontName: string]: FontWeights;
}

interface FontSrcMap {
    [fontName: string]: {
        src: string[];
        parentPath: string;
    };
}



async function getFontAndSrcMaps(websiteUrl: string, isDev: boolean): Promise<{ fontMap: FontMap; fontSrcMap: FontSrcMap; }> {
    const browser = await getBrowser(isDev);
    await browser.goto(websiteUrl);

    return await browser.evaluate(() => {

        function getFontSrcMap(tidyFontName: (font: string) => string, extractFontUrls: (s: string) => string[], getParentPath: (url: string) => string) {
            const map = new Map<string, { src: any[]; parentPath: string; }>();

            const documentStylesheets = [...document.styleSheets];
            documentStylesheets.forEach(documentStylesheet => {
                const cssRules = [...documentStylesheet.cssRules];
                cssRules.forEach(cssRule => {
                    if (cssRule instanceof CSSFontFaceRule) {
                        map.set(tidyFontName(cssRule.style.fontFamily), {
                            src: extractFontUrls((cssRule as any).style?.src),
                            parentPath: getParentPath(cssRule.parentStyleSheet.href)
                        });
                    }

                    if (cssRule instanceof CSSImportRule) {
                        const nestedStylesheet = cssRule.styleSheet;
                        const nestedCssRules = [...nestedStylesheet.cssRules];
                        nestedCssRules.forEach(rule => {
                            if (rule instanceof CSSFontFaceRule) {
                                map.set(tidyFontName(rule.style.fontFamily), {
                                    src: extractFontUrls((rule as any).style?.src),
                                    parentPath: getParentPath(rule.parentStyleSheet.href)
                                });
                            }
                        });
                    }
                });
            });

            return map;
        }


        function getFontMap(nodes: Element[], tidyFontName: (font: string) => string) {
            const fontMap = new Map<string, string[]>();


            const pseudoElements = ['', ':before', ':after'];
            nodes.forEach(node => {
                pseudoElements.forEach(pseudo => {
                    const { fontFamily, fontWeight } = window.getComputedStyle(node, pseudo);
                    // console.log(fontFamily)
                    if (!fontFamily)
                        return null;

                    fontFamily.split(/\n*,\n*/g).forEach(font => {
                        const fontName = tidyFontName(font);
                        if (fontMap.has(fontName)) {
                            fontMap.set(fontName, [...fontMap.get(fontName), fontWeight]);
                        } else {
                            fontMap.set(fontName, [fontWeight]);
                        }
                    });
                });
            });
            return fontMap;
        }


        function tidyFontName(font: string) {
            return font.replace(/^\s*['"]([^'"]*)['"]\s*$/, '$1').trim();
        }

        function getAllNodes() {
            return Array.from(window.document.getElementsByTagName('*'));
        }

        const getParentPath = (url: string | null) => (url ?? '').substring(0, (url ?? '').lastIndexOf("/"));

        function extractFontUrls(s: string) {
            if (!s) return null

            const srcs = s.split(',');
            // return srcs
            return srcs.map(src => {
                const urls = src.match(/(?<=")(.*\.(ttf|woff2|woff|otf|eot))/g);
                if (urls) {
                    return urls;
                }
            }).filter(Boolean).flat();

        };




        const nodes = getAllNodes();
        const fontMap = getFontMap(nodes, tidyFontName);
        const fontSrcMap = getFontSrcMap(tidyFontName, extractFontUrls, getParentPath);
        return { fontMap: Object.fromEntries(fontMap), fontSrcMap: Object.fromEntries(fontSrcMap) };
    });



}


async function mergeFontAndSrcMap(fontMap: FontMap, fontSrcMap: FontSrcMap) {

    interface FontObj {
        [fontName: string]: {
            weights: string[],
            src: SrcObj,
            svg: string
        } | undefined
    }
    type SrcObj = {
        [type in SrcTypes]: string;
    };


    type SrcTypes = 'eot' | 'ttf' | 'otf' | 'woff' | 'woff2'


    const selectFontSrc = (font: SrcObj) => {
        return font?.ttf ?? font?.otf ?? font?.woff2 ?? font?.woff ?? font?.eot;
    }

    let fontObj: FontObj = {};
    for (const fontName in fontMap) {
        const { src, parentPath: href } = fontSrcMap?.[fontName] ?? { src: [], parentPath: '' };
        fontObj[fontName] = {
            weights: Array.from(new Set(fontMap[fontName])),
            ...await (async () => {
                const srcObj = src.reduce((srcObj, s) => {
                    const extension = s.split('.').pop() as SrcTypes
                    srcObj[extension] = convertRelativeToAbsolute(href, s)
                    return srcObj
                }, {} as SrcObj)

                const fontPath = await convertFontToPath(selectFontSrc(srcObj), 'Hello')


                return { src: srcObj, svg: fontPath }
            })()
            ,
            // href
        };
    }
    return fontObj;

}


export default async (websiteUrl: string, isDev: boolean) => {
    const { fontSrcMap, fontMap } = await getFontAndSrcMaps(websiteUrl, isDev)

    return mergeFontAndSrcMap(fontMap, fontSrcMap)
}