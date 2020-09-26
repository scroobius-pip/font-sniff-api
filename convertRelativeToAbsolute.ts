const urlJoin = require('url-join');

function convertRelativeToAbsolute(base_url: string, currentUrl: string) {
    if (currentUrl[0] === '/')
        return (new URL(base_url)).host + currentUrl;
    if (!currentUrl || /^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(currentUrl)) {
        return currentUrl;
    }
    return urlJoin(base_url, currentUrl);
}

export default convertRelativeToAbsolute