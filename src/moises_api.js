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
