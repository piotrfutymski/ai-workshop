import { ChatOpenAI } from "@langchain/openai";
import { OPEN_AI_KEY } from "./key";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const extractAllIngredientsFromImages = async (base64Imgs: string[] | null) => {
    return base64Imgs
    ? (await Promise.all(base64Imgs.map(async e => await describeIngredientsOnImage(e)))).join(",")
    : "";
}


export const describeIngredientsOnImage = async (base64Img: string) => {
    return "";
}