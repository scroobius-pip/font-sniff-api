import getFontInfo from './getFontInfo';

const isDev = !process.env.AWS_REGION;


const websiteUrl = 'https://www.relate.app/';

(async () => {

    const fontInfo = await getFontInfo(websiteUrl, isDev);
    console.log(fontInfo)


})()



