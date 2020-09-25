import { juiceResources } from 'juice';
import { getHostName } from './index';

// const dom = new jsdom.JSDOM()
const inlineHtml = (html: string, url: string) => new Promise<string>((resolve, reject) => {
    juiceResources(html, {
        inlinePseudoElements: true, webResources: {
            scripts: false,
            relativeTo: url,
            images: false,
            svgs: false,
        }
    }, (err, html) => {
        err ? (console.log('error occurred'), reject(err)) : (console.log('Successfully inlined html'), resolve(html));
    });
});


// ' ' ? 'dd' : 'dalkdsalfkjlskdfkl'

export default inlineHtml