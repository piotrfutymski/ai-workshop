import { ChatOpenAI } from "@langchain/openai";
import { OPEN_AI_KEY } from "./key";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { priceTool } from "./4agents";

export const resultFromChatIncludingRecipes = async (ingredeintsWithText: string, relevantRecipes: string) => {

    const model = new ChatOpenAI({
        modelName: "gpt-4o",
        openAIApiKey: OPEN_AI_KEY,
    });

    const systemMessage = `
        Jesteś asystentem pomagającym przygotować świąteczne potrawy. Poniżej znajdują się przepisy na 3 potrawy:
        
        {recipes}
        
        Przygotuj odpowiedź dla użytkownika w której podasz te 3 przepisy, ponadto uwzględniając dodatkowe informacje:
        - Podasz listę zakupów w ramach której podasz też ceny produktów. Lista zakupów powinna uwzględniać tylko te produkty których użytkownik nie posiada lub ich zabraknie. Użytkownik dostarczy listę produktów
        - Podaj kolejno 3 przepisy
        - Weź pod uwagę to, że jeśli kilka potraw wykorzystuje ten sam składnik, to on sę może wyczerpać i trzeba będzie go dokupić dlatego uwzględnij odpowiednią ilość w liście zakupów.
        - Zastosuj format odpowiedzi - nawiasy kwadratowe zamień na to co one opisują:

        Lista zakupów:              // globalna list brakujących składników dla wszystkich 3 potraw
        1. [brakujący składnik 1] [cena]
        2. [brakujący składnik 2] [cena]
        ...

        [Nazwa potrawy 1]

        Potrzebne składniki:        // zawżyj tu wszystkie składniki potrzebne do tej konkretnej potrawy niezależnie czy użytkownik je ma czy nie
        1. [składnik 1] [napisz czy pochodzi z listy zakupów czy z tego co już mam]
        2. [składnik 2] [napisz czy pochodzi z listy zakupów czy z tego co już mam]

        Przepis:
        [przepis na potrawę 1]

        [Nazwa potrawy 2]
        ...
        
    `

    const userMessage = "Pomóż mi przygotować Świąteczne potrawy. Oto co mam w spiżarni: {text}"

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemMessage],
        ["user", userMessage]
    ])

    const messages = await promptTemplate.invoke({text: ingredeintsWithText, recipes: relevantRecipes});

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