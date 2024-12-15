import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { OPEN_AI_KEY } from "./key";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const pricesSchema = z.object({
    item: z.string().describe("Name of product to get price for")
})



export const langchainWithTools = async (text: string) => {
    return "";
}