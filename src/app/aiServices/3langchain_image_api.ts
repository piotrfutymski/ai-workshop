import { ChatOpenAI } from "@langchain/openai";
import { OPEN_AI_KEY } from "./key";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const extractAllIngredientsFromImages = async (base64Imgs: string[] | null) => {
    return base64Imgs
    ? (await Promise.all(base64Imgs.map(async e => await describeIngredientsOnImage(e)))).join(",")
    : "";
}


export const describeIngredientsOnImage = async (base64Img: string) => {
    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        openAIApiKey: OPEN_AI_KEY,
    });

    const systemMessage = `
        Wypisz wszystkie składniki, które mogą być wykorzystane do przygotowania potraw i znajdują się na zdjęciu.
        W odpowiedzi uwzględnij co jest na zdjęciu a także ilość składnika.
        Odpowiedź podaj jako listę przedzieloną przecinkami. 
        Koniecznie oszacuj ilość danego składnika. Przykład odpowiedzi:
        mąka 500g, jajka 10 szt., cukier ok. 100g, przyprawa do piernika - jedno opakowanie 
    `

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemMessage],
        [
          "user",
          [{ type: "image_url", image_url: "{base64Img}" }],
        ],
      ]);

    const chain = prompt.pipe(model);
    const response = await chain.invoke({ base64Img });

    return response.content;

}