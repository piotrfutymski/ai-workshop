import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { OPEN_AI_KEY } from "./key";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const langchainCall = async (text: string) => {
    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        openAIApiKey: OPEN_AI_KEY,
    });
    return "";
}