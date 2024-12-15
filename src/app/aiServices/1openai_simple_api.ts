import axios from 'axios';
import { OPEN_AI_KEY } from './key';

export const simpleOpenAICall = async (text: string) => {
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPEN_AI_KEY}`,
    };
    return "Niestety nie zostałem zaprogramowany. Wymyśl potrawy na Święta sam/a!";
}