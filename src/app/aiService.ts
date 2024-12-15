import { simpleOpenAICall } from "./aiServices/1openai_simple_api";
import { langchainCall } from "./aiServices/2langchain_simple";
import { extractAllIngredientsFromImages } from "./aiServices/3langchain_image_api";
import { langchainWithTools } from "./aiServices/4agents";
import { findBestRecipes } from "./aiServices/5rag";
import { resultFromChatIncludingRecipes } from "./aiServices/final";

export const generateAIResponse1 = async (
    filesBase64: string[] | null,
    textInput: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      simpleOpenAICall(textInput)
          .then(e=>resolve(e))
    });
  };


  export const generateAIResponse2 = async (
    filesBase64: string[] | null,
    textInput: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      langchainCall(textInput)
          .then(e=>resolve(e))
    });
  };


  export const generateAIResponse3 = async (
    filesBase64: string[] | null,
    textInput: string
  ): Promise<string> => {
    return new Promise(async (resolve) => {

      extractAllIngredientsFromImages(filesBase64)
      .then(e=>resolve(e));
    });
  };

  export const generateAIResponse4 = async (
    filesBase64: string[] | null,
    textInput: string
  ): Promise<string> => {
    return new Promise(async (resolve) => {

      langchainWithTools(textInput)
      .then(e=>resolve(e));
    });
  };


  export const generateAIResponse5 = async (
    filesBase64: string[] | null,
    textInput: string
  ): Promise<string> => {
    return new Promise(async (resolve) => {

      findBestRecipes(textInput)
      .then(e=>resolve(e));
    });
  };


  export const generateAIResponseFull = async (
    filesBase64: string[] | null,
    textInput: string
  ): Promise<string> => {
    return new Promise(async (resolve) => {

      const ingredients = await extractAllIngredientsFromImages(filesBase64);
      const ingredientsWithInputText = ingredients + "\n" + textInput;

      const relevantRecipes = await findBestRecipes(ingredientsWithInputText);

      const resultWithRelevantRecipes = await resultFromChatIncludingRecipes(ingredientsWithInputText, relevantRecipes)
      resolve(resultWithRelevantRecipes)
    });
  };