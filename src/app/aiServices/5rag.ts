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

    const fileContent = await getRecipes();

    const textSplitter = new CharacterTextSplitter({
        separator: "---"
    });

    const recipes = await textSplitter.createDocuments([fileContent]);

    console.log(recipes);

    //

    const embeddingsModel = new OpenAIEmbeddings({apiKey: OPEN_AI_KEY});


    const textEmbeddings = await embeddingsModel.embedQuery(text);

    console.log(textEmbeddings)

    const recipesEmbeddings = await embeddingsModel.embedDocuments(recipes.map(e=>e.pageContent));

    const vectorStore = new MemoryVectorStore(embeddingsModel);

    const similarities = recipesEmbeddings.map(recipeEmbeddings => vectorStore.similarity(textEmbeddings, recipeEmbeddings))

    console.log(similarities);

    const recipesWithSimilarities = recipes.map((e,i)=> ({recipe: e, value: similarities[i]}));

    const relevantRecipes = recipesWithSimilarities.sort((a,b) => - a.value + b.value).slice(0,3);

    return relevantRecipes.map(e=>e.recipe.pageContent).join("\n\n")
   
}

