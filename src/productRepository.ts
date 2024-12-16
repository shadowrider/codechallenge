import {scrapeWebPage} from "./scraper/scraper";
import {findMostRelevantWebPage} from "./crawler/client";
import {ProductNotFound} from "./errors/notfound";
import {createProductInfoFromHTML} from "./openai/client";

// TODO: Implement model layer with data validation
// TODO: Implement remote storage

export async function getProductInfo(productName: string) {

    // TODO: Implement remote storage long term caching, so that data can be presented to the user faster

    // OpenAI API doesn't allow direct internet searches, so we use 3rd party Internet Search Engine to crawl web
    const linkToMostRelevantResult = await findMostRelevantWebPage(productName);
    if (linkToMostRelevantResult.length <= 0) {
        throw new ProductNotFound(`${productName} not found`);
    }

    // Load most relevant page into headless browser to scrape the page
    const htmlResult = await scrapeWebPage(linkToMostRelevantResult)

    // Send data to LLM for analysis
    const formattedResult = await createProductInfoFromHTML(productName, htmlResult);

    // TODO: Create or Update a record in the remote storage without waiting for the result
    return formattedResult
}