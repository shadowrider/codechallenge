import dotenv from 'dotenv';
import {getGoogleSearchResults} from "./google";
import {ProductNotFound} from "../errors/notfound";
import * as sea from "node:sea";

// Load environment variables from .env file
dotenv.config();

// Trust information from eComm platforms as it's been verified and moderated
const eCommDomains = (process.env.TRUSTED_ECOMM_DOMAINS ?? '').split(' ')

export async function findMostRelevantWebPage(searchTerm: string): Promise<string> {
    try {
        const searchResults = await getGoogleSearchResults(searchTerm)

        if (!searchResults.length) {
            throw new ProductNotFound(`${searchTerm} not found`);
        }

        // Check if any of the search results are pages from ecommerce platforms
        // Usually they have well-structured data and abundance of needed information
        const eCommDomainResultIndex = searchResults.findIndex((result) => {
            const resultUrl = new URL(result.link)
            return eCommDomains.reduce((result, domainName) => {
                return resultUrl.hostname.includes(domainName) || result
            }, false)
        })

        // Make sure it's a product page that has our search term in it
        const titleMatchResultIndex = searchResults.findIndex((result) => {
            return result.title ? result.title.toLowerCase().includes(searchTerm.toLowerCase()) : false
        })

        const hasFullMatch = eCommDomainResultIndex === titleMatchResultIndex && eCommDomainResultIndex > -1
        const titleMatches = titleMatchResultIndex > -1
        const eCommDomainPartOfUrl = eCommDomainResultIndex > -1

        if (hasFullMatch) {
            return searchResults[eCommDomainResultIndex].link
        }

        if (titleMatches) {
            return searchResults[titleMatchResultIndex].link
        }

        if (eCommDomainPartOfUrl) {
            return searchResults[eCommDomainResultIndex].link
        }

        throw new ProductNotFound(`${searchTerm} not found`);
    } catch (error: any) {
        throw error;
    }
}