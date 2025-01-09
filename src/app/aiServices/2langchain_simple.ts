import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { OPEN_AI_KEY } from "./key";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";


//Zadania: strukturyzacja odpowiedzi

export const langchainCall = async (text: string) => {
    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        openAIApiKey: OPEN_AI_KEY,
    });

    const systemMessage = `
        Jesteś asystentem pomagającym przygotować świąteczne potrawy. Mając dostarczony przez użytkownika opis
        tego jakie ma składniki w domu, zaproponuj 3 przepisy na tradycyjne polskie potrawy świąteczne, w których
        będzie mógł wykorzystać podane składniki. Jeśli nie ma jakichś potrzebnych składników, twoja odpowiedź, powinna
        zawierać informację o tym jakie składniki powinien kupić. Przykładowy szablon odpowiedzi (dla jednego przepisu):

        Lista zakupów:          // globalna dla wszystkich 3 potraw
        1. [brakujący składnik 1]
        2. [brakujący składnik 2]

        [Nazwa potrawy 1]

        Potrzebne składniki:        // zawżyj tu wszystkie łącznie z tymi z listy zakupów
        1. [składnik 1]
        2. [składnik 2]

        Przepis:
        [przepis na potrawę 1]

        [Nazwa potrawy 2]
        ...

        Weź pod uwagę to, że jeśli kilka potraw wykorzystuje ten sam składnik, to on sę może wyczerpać i trzeba będzie go dokupić.
    `

    const messages = [
        new SystemMessage(systemMessage),
        new HumanMessage(text)
    ]

    const parser = new StringOutputParser();

    return await parser.invoke(await model.invoke(messages));

}

export const langchainPromptTemplate = async (text: string) => {
    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        openAIApiKey: OPEN_AI_KEY,
    });

    const systemMessage = `
        Jesteś asystentem pomagającym przygotować świąteczne potrawy. Mając dostarczony przez użytkownika opis
        tego jakie ma składniki w domu, zaproponuj 3 przepisy na tradycyjne polskie potrawy świąteczne, w których
        będzie mógł wykorzystać podane składniki. Jeśli nie ma jakichś potrzebnych składników, twoja odpowiedź, powinna
        zawierać informację o tym jakie składniki powinien kupić. Przykładowy szablon odpowiedzi (dla jednego przepisu):

        Lista zakupów:          // globalna dla wszystkich 3 potraw
        1. [brakujący składnik 1]
        2. [brakujący składnik 2]

        [Nazwa potrawy 1]

        Potrzebne składniki:        // zawżyj tu wszystkie łącznie z tymi z listy zakupów
        1. [składnik 1]
        2. [składnik 2]

        Przepis:
        [przepis na potrawę 1]

        [Nazwa potrawy 2]
        ...

        Weź pod uwagę to, że jeśli kilka potraw wykorzystuje ten sam składnik, to on sę może wyczerpać i trzeba będzie go dokupić.
    `

    const userMessage = "Pomóż mi przygotować Świąteczne potrawy. Oto co mam w spiżarni: {text}"

    const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", systemMessage],
        ["user", userMessage]
    ])

    const messages = await promptTemplate.invoke({text: text});

    const parser = new StringOutputParser();

    return await parser.invoke(await model.invoke(messages));

}