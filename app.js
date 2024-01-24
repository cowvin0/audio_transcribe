import fs from 'fs';
import Moises from 'moises/sdk.js';

const moises = new Moises({ apiKey: ' d19c8c4a-c8f4-49a6-9f06-9af94e7d7db9' });

async function runMoises() {
    try {
        await moises.processFolder(
            'TesteHackTheMusic', // Nome do fluxo de trabalho
            './Audio', // Pasta de entrada
            './Steams',
            {}
        );

        console.log('Processo Moises concluído com sucesso!');

        // Lê o resultado do arquivo "Output 1.json"
        const resultFilePath = 'Steams/track/Output 1.json';
        const resultData = JSON.parse(fs.readFileSync(resultFilePath, 'utf-8'));

        // Aqui você pode trabalhar com os dados do resultado, por exemplo:
        console.log('Texto transcriado:', resultData[0].text);
        console.log('Idioma detectado:', resultData[0].language);

        // Salvar resultData[0].text em um arquivo .txt
        fs.writeFile('Steams/track/Output 1.txt', resultData[0].text, function (err) { });
    } catch (error) {
        console.error('Erro no processo Moises:', error);
    }
}

// Chame a função para executar o Moises SDK
//runMoises();


async function TexToSpeach() {
    // Use Moises para converter o texto em fala

    try {
        await moises.processFolder(
            'TextToAudio', // Nome do fluxo de trabalho        
            './text/cf.txt', // Pasta de entrada
            './results', {}); // Pasta de saída
        console.log('Processo T Moises concluído com sucesso!');

    } catch (error) {
        console.error('Erro no processo Moises:', error);
    }


}


async function TexToSpeech(){
    try{
        const downloadUrl = await moises.uploadFile('./text/cf.txt');
        console.log('Arquivo enviado para o Moises:', downloadUrl);
        const jobId = await moises.addJob("job-1t", "TextToAudio", {InputText: downloadUrl});
        console.log('Job adicionado:', jobId);
        const job = await moises.waitForJobCompletion(jobId);
        console.log('Job concluído:', job);

        if (job.status === 'SUCCEEDED') {
            const files = await moises.downloadJobResults(job, './results');
            console.log('Arquivos baixados:', files);
        }else{
            console.log('Job falhou:', job);

        }

    }catch(error){
        console.error('Erro no processo Moises:', error);

    }
}

TexToSpeech();