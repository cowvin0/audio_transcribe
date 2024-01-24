import "dotenv/config"
import fs from "fs";
import Moises from "moises/sdk.js"

const moises = new Moises({ apiKey: process.env.API_KEY })

export async function transcribeMoises() {
    try {
        await moises.processFolder(
            "TesteHackTheMusic",
            "./src/audio",
            "./src/steams",
            {}
        );

        console.log("Completed Transcription");

        const resultFilePath = "./src/steams/audio/output.json";
        const resultData = JSON.parse(fs.readFileSync(resultFilePath, "utf-8"));

        console.log("Transcribed:", resultData[0].text);
        console.log("Detected language:", resultData[0].language);
        return resultData[0].text;
    } catch (error) {
        console.log("Error:", error);
    }
}

async function TextToSpeech(textMessage) {
    try {

        fs.writeFile("./src/text/cf.txt", textMessage, (err) => {
            if (err) throw err;
            console.log("File has been saved.");
        });

        const downloadUrl = await moises.uploadFile('./src/text/cf.txt');
        console.log('Arquivo enviado para o Moises:', downloadUrl);

        const jobId = await moises.addJob(
            "job-1t",
            "TextToAudio",
            {InputText: downloadUrl}
        );
        console.log('Added job:', jobId);

        const job = await moises.waitForJobCompletion(jobId);
        console.log('Done job:', job);

        if (job.status === 'SUCCEEDED') {
            const files = await moises.downloadJobResults(job, './src/results');
            console.log('Arquivos baixados:', files);
            await moises.deleteJob(jobId);
        } else{
            console.log('Job falhou:', job);
        }
    } catch (error) {
        console.error("Error:", error)
    }
}

TextToSpeech("testando api da moises");
