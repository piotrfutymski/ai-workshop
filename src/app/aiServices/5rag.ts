import { OpenAIEmbeddings } from "@langchain/openai";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OPEN_AI_KEY } from "./key";

export const getRecipes = async () => {
    const response = await fetch("/potrawy_wigilijne.txt");
    const data = await response.text();
    return data;
  };

export const findBestRecipes = async (text: string) => {
    return "";
}

