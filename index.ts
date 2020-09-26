import getFontInfo from './getFontInfo';
const write = require('write')
import convertFontToPath from './convertFontToPath';

export const isDev = !process.env.AWS_REGION;


const websiteUrl = 'https://www.artstation.com/pranetoid';

(async () => {

    const fontInfo = await getFontInfo(websiteUrl, isDev);
    console.log(fontInfo)


})()



