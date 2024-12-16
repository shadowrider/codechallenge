import puppeteer from 'puppeteer';

/**
 * Scrapes a webpage and returns its content as string.
 * @param url - The URL of the webpage to scrape.
 * @returns The text content of the webpage.
 */
export async function scrapeWebPage(url: string): Promise<string> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extract the main text content of the page
        const content = await page.evaluate(() => {
            return document.body.innerText;
        });

        return content;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        throw error;
    } finally {
        await browser.close();
    }
}