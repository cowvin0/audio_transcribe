import "dotenv/config"
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import Moises from "moises/sdk.js"

const moises = new Moises({ apiKey: process.env.API_KEY })

export async function transcribeMoises() {
    try {
        await moises.processFolder(
            "TesteHackTheMusic",
            "./src/audio", "./src/steams",
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

export async function textToSpeech(textMessage) {
    try {

        fs.writeFile("./src/text/cf.txt", textMessage, (err) => {
            if (err) throw err;
            console.log("File has been saved.");
        });

        const downloadUrl = await moises.uploadFile('./src/text/cf.txt');
        console.log('File sent to Moises:', downloadUrl);

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
            console.log('Downloaded files:', files);
            await moises.deleteJob(jobId);
            return files;
        } else{
            console.log('Job failed:', job);
        }
    } catch (error) {
        console.error("Error:", error)
    }
}

export async function convertWavToMp3(inputFilePath) {
    const outputFilePath = inputFilePath.replace(".wav", ".mp3");

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(inputFilePath)
            .audioCodec("libmp3lame")
            .on("end", () => {
                console.log("Conversion finished");
                resolve();
            })
            .on("error", (err) => {
                console.error("Error:", err);
                reject(err);
            })
            .save(outputFilePath);
    });
}
