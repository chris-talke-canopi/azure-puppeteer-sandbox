import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import puppeteer from "puppeteer";

export async function getText(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();

    await page.goto('https://pptr.dev/');

    const text = await page.evaluate( () => {
        let text = document.querySelector('#__docusaurus_skipToContent_fallback > div > div > main > div > div > div.col.docItemCol_VOVn > div > article > div.theme-doc-markdown.markdown > blockquote').textContent;
        return text || `This didn't work`;
    });

    return { body: text };
};

app.http('getText', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getText
});
