import {ChatCompletionCreateParamsNonStreaming} from "openai/src/resources/chat/completions";
import {zodResponseFormat} from "openai/helpers/zod";
import ZodSchema from "./responseFormat";
import dotenv from 'dotenv';
import OpenAI from "openai";
import {ProductNotFound} from "../errors/notfound";

// Load environment variables from .env file
dotenv.config();

// OpenAI
const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// TODO: List required information in the prompt
// TODO: Optimize prompt for processing raw html string of specific
//  eComm product pages by using css selectors for required fields
const systemQuery = "You are a master at scraping and parsing raw HTML.\n"
    +"You are asked to provide the information about a product.\n"
    +"You will be provided with HTML string\n"
    +"Once you are ready, send the information to the user in one message";

export async function createProductInfoFromHTML(productName:string, htmlResult: string): Promise<any> {
    const data: ChatCompletionCreateParamsNonStreaming = {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemQuery },
            { role: "user", content: htmlResult },
        ],
        n: 1, // limit to one choice to minimize costs
        temperature: 0.2, //Generates data analysis scripts that are more likely to be correct and efficient. Output is more deterministic and focused.
        response_format: zodResponseFormat(ZodSchema, 'productResponse')
    };

    try {
        const response = await openAIClient.chat.completions.create(data);
        if (response.choices.length < 1 || !response.choices[0].message || !response.choices[0].message.content) {
            throw new ProductNotFound(`${productName} not found`);
        }

        const result: any = JSON.parse(response.choices[0].message.content as string);

        // TODO: Implement more thorough check for hallucinations
        // Naive check so that at least product name fully or partially matches
        const lowerCaseResultProductName = result.product.name.toLowerCase()
        const hasPartialNameMatch = productName.toLowerCase().split(' ').reduce((result, nameWord) => {
            return lowerCaseResultProductName.includes(nameWord) || result;
        }, false)
        if (result && hasPartialNameMatch) {
            return result;
        }

        throw new ProductNotFound(`${productName} not found`);
    } catch (error: any) {
        // @ts-ignore
        console.error(
            "Error calling ChatGPT API:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}