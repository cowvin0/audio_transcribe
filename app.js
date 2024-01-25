import fs from 'fs';
import Moises from 'moises/sdk.js';
import OpenAI from 'openai';
import Bard from "bard-ai";


const BardKey = "fgjkzvBFBkukwS6way2FY7EDLWD41s1LIrQF--Oa8uiG-kB_pd-t6aDrUCGW40JkeaWqsQ.";
const GPT_KEY = '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';
const moises = new Moises({ apiKey: ' d19c8c4a-c8f4-49a6-9f06-9af94e7d7db9' });
//Variavel para armazenar o texto transcrito Globalmente
var textoTranscrito = "";

console.log("Usando sdk moises");

async function runMoises() {
    try {
        await moises.processFolder(
            'TesteHackTheMusic', // Nome do fluxo de trabalho
            './Input', // Pasta de entrada
            './Output',
            {}
        );

        console.log('Processo Moises concluído com sucesso!');

        // Lê o resultado do arquivo "Output 1.json"
        const resultFilePath = 'Output/TesteGptMoises/Output.json';
        const resultData = JSON.parse(fs.readFileSync(resultFilePath, 'utf-8'));
        textoTranscrito = resultData[0].text;

        // Aqui você pode trabalhar com os dados do resultado, por exemplo:
        console.log('Texto transcriado:', resultData[0].text);
        console.log('Idioma detectado:', resultData[0].language);


        // Salvar resultData[0].text em um arquivo .txt
        fs.writeFile('Output/track/Transcrypt.txt', resultData[0].text, function (err) { });
    } catch (error) {
        console.error('Erro no processo Moises:', error);
    }

}


// async function main() {


//     let myBard = new Bard(BardKey);

//     console.log(await myBard.ask("Forneça instruções de forma simples e objetiva para uma pessoa leiga a respeito das funcionalidades do aplicativo WhatsApp :\n" + textoTranscrito));  

// }



/// Insufficient Quota for GPT-3 -- Error

const openai = new OpenAI({
  apiKey: GPT_KEY, // This is the default and can be omitted
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: 'Forneça instruções de forma simples e objetiva para uma pessoa leiga a respeito das funcionalidades do aplicativo WhatsApp' },
        { role: 'user', content: textoTranscrito },
    ], max_tokens: 15
    });

    console.log(chatCompletion.data);

}


runMoises();
main();



