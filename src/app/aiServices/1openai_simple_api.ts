import axios from 'axios';
import { OPEN_AI_KEY } from './key';


//Zadanie: Pobawić się temperaturą

export const simpleOpenAICall = async (text: string) => {
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPEN_AI_KEY}`,
    };

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

    const data = {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          {
            role: 'user',
            content: text,
          },
        ],
    };

    try {
        const response = await axios.post(apiEndpoint, data, { headers });
        const aiResponse = response.data.choices[0].message.content;
        return aiResponse;
      } catch (error) {
        console.error('Error fetching AI response:', error);
        throw new Error('Failed to fetch AI response');
      }

}