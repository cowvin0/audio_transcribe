import fs from 'fs';
import Moises from 'moises/sdk.js';

const moises = new Moises({ apiKey: ' d19c8c4a-c8f4-49a6-9f06-9af94e7d7db9' });
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

    //     // Lê o resultado do arquivo "Output 1.json"
    //     const resultFilePath = 'MoisesFiles/Output/track/Output 1.json';
    //     const resultData = JSON.parse(fs.readFileSync(resultFilePath, 'utf-8'));

    //     // Aqui você pode trabalhar com os dados do resultado, por exemplo:
    //     console.log('Texto transcriado:', resultData[0].text);
    //     console.log('Idioma detectado:', resultData[0].language);

    //     // Salvar resultData[0].text em um arquivo .txt
    //     fs.writeFile('Steams/track/Output 1.txt', resultData[0].text, function (err) { });
    // } catch (error) {
    //     console.error('Erro no processo Moises:', error);
    

    } catch (error) {
        console.error('Erro no processo Moises:', error);
    }
}

runMoises();