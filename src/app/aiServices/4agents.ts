import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { OPEN_AI_KEY } from "./key";
import { ChatPromptTemplate } from "@langchain/core/prompts";

//Zadania: dodać kalkulator

const pricesSchema = z.object({
    item: z.string().describe("Name of product to get price for")
})

export const priceTool = tool(
    async({ item }) => {
        if(item.toLowerCase() === "masło"){
            return 12.5
        }else{
            return item.length * 1.25;
        }
    },
    {
        name: "priceCalculator",
        description: "Tool to calculate price for items",
        schema: pricesSchema
    }
)

export const langchainWithTools = async (text: string) => {
    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        openAIApiKey: OPEN_AI_KEY,
    });

    const systemMessage = `
        Jesteś asystentem pomagającym przygotować świąteczne potrawy. Mając dostarczony przez użytkownika opis
        tego jakie ma składniki w domu, zaproponuj 3 przepisy na tradycyjne polskie potrawy świąteczne, w których
        będzie mógł wykorzystać podane składniki. Jeśli nie ma jakichś potrzebnych składników, twoja odpowiedź, powinna
        zawierać informację o tym jakie składniki powinien kupić. Ponadto wypisując listę zakupów podaj ceny produktów. 
        Przykładowy szablon odpowiedzi (dla jednego przepisu):

        Lista zakupów:              // globalna list brakujących składników dla wszystkich 3 potraw
        1. [brakujący składnik 1] [cena]
        2. [brakujący składnik 2] [cena]

        [Nazwa potrawy 1]           //Nazwa pierwszej potrawy

        Potrzebne składniki:        // zawżyj tu wszystkie skłądniki potrzebne do tej konkretnej potrawy
        1. [składnik 1] [napisz czy pochodzi z listy zakupów czy z tego co już mam]
        2. [składnik 2] [napisz czy pochodzi z listy zakupów czy z tego co już mam]

        Przepis:
        [przepis na potrawę 1]

        [Nazwa potrawy 2]
        ...

        Weź pod uwagę to, że jeśli kilka potraw wykorzystuje ten sam składnik, to on sę może wyczerpać i trzeba będzie go dokupić dlatego uwzględnij odpowiednią ilość w liście zakupów.
    `

    const userMessage = "Pomóż mi przygotować Świąteczne potrawy. Oto co mam w spiżarni: {text}"

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemMessage],
        ["user", userMessage]
    ])

    const messages = await promptTemplate.invoke({text: text});

    //


    const modelWithTools = model.bindTools([priceTool])
    const resWithToolCalls = await modelWithTools.invoke(messages);
    console.log(resWithToolCalls.tool_calls);

    messages.messages.push(resWithToolCalls);

    //

    for (const toolCall of resWithToolCalls.tool_calls || []) {
        const toolMessage = await priceTool.invoke(toolCall);
        console.log(toolMessage);
        messages.messages.push(toolMessage);
    }

    //

    const res = await model.invoke(messages);

    return res.content.toString();

}