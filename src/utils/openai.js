import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI
});

export async function openInterpret(textMessage, whoIsTheBot = 'Forneça instruções de forma simples e objetiva para uma pessoa leiga a respeito das funcionalidades do aplicativo WhatsApp. Responda de formas simples e simbólica, considerando que você está conversando com uma pessoa leiga.') {
    console.log("GPT getting message!") ;
    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: whoIsTheBot },
            { role: 'user', content: textMessage },
        ], 
        max_tokens: 1000
    });
    
    const textContent = chatCompletion.choices[0].message.content;
    console.log("GPT answer:", textContent);
    return textContent;
}
