import * as axios from "axios";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Search Engine Config
const googleapikey = process.env.GOOGLE_API_KEY;
const googleContext = process.env.GOOGLE_SEARCH_ENGINE;

export async function getGoogleSearchResults(searchTerm: string): Promise<any[]> {
    const googleUrl = "https://www.googleapis.com/customsearch/v1";
    const googleData = {
        key: googleapikey,
        cx: googleContext,
        q: searchTerm,
    };

    try {
        const response = await axios.get<any>(googleUrl, { params: googleData });

        // We are taking naive approach and assume that if result is not presented
        // on the first page of the search results, then most likely it is not relevant
        return response.data.items
    } catch (error: any) {
        console.error(
            "Error calling Google API:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}