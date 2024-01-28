import express from "express";
import "dotenv/config";
import { convertWavToMp3, transcribeMoises, textToSpeech } from "./utils/moises.js";
import fetch from "node-fetch";
import { openInterpret } from "./utils/openai.js";
import fs from "fs";
import TwilioSDK from "twilio";
import bodyParser from "body-parser";

const app = express();

const accountSid = process.env.TWILIO_SID; 
const authToken = process.env.TWILIO_TOKEN;
const port = process.env.PORT;
const client = TwilioSDK(accountSid, authToken);
const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
const headers = { 'Authorization': `Basic ${basicAuth}`
};

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.get("/", (req, res) => {
    res.send("Hello, this is the root route");
})

app.post("/webhook", async (req, res) => {
    const messageBody = req.body.Body;
    const sender = req.body.From;

    if (req.body.NumMedia > 0) {
        const mediaUrl = req.body.MediaUrl0;
        console.log(`Received audio message from ${sender}. Media URL: ${mediaUrl}`);

        try {

            await fetch(mediaUrl, { headers })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    return response.arrayBuffer();
                })
                .then(data => {
                    const buffer = Buffer.from(data);

                    fs.writeFileSync("src/audio/audio.mp3", buffer);

                    console.log("File saved successfully");
                })
                .catch(error => {
                    console.log("Fetch error:", error);
                });

            const questionText = await transcribeMoises();
            const gptAnswer = await openInterpret(questionText);
            const audioTranscribed = await textToSpeech(gptAnswer);
            console.log(audioTranscribed);
            const ngrokHttps = "https://b62b-45-227-107-214.ngrok-free.app/" + 
                audioTranscribed.voice_output.replace("./", "").replace(".wav", ".mp3")

            console.log("Transform audio to .mp3:", audioTranscribed);
            await convertWavToMp3(audioTranscribed.voice_output);

            await client.messages
                    .create({
                        mediaUrl: ngrokHttps,
                        from: process.env.FROM,
                        to: sender
            });

        } catch (error) {
            console.error(`Error handling media from ${sender}: ${error.message}`);
        }

    } else {
        console.log(`Received text message from ${sender}: ${messageBody}`);

        try {

            const gptInterpret = await openInterpret(messageBody, "Forneça interpretação de texto para uma pessoa que não sabe ler. A mensagem deverá ser interpretada e explicada, dizendo o que significa. A mensagem será posteriormente passada para aúdio e a pessoa poderá compreender a sua resposta.");
            const audioInterpret = await textToSpeech(gptInterpret);
            const ngrokUrl = "https://b62b-45-227-107-214.ngrok-free.app/" + 
                audioInterpret.voice_output.replace("./", "").replace(".wav", ".mp3")

            console.log("Transform audio to .mp3:", audioInterpret);
            await convertWavToMp3(audioInterpret.voice_output);

            client.messages
                .create({
                    mediaUrl: ngrokUrl,
                    from: process.env.FROM,
                    to: sender
                });

            console.log(`Sent text response to ${sender}`);
        } catch (error) {
            console.error(`Error sending text response to ${sender}: ${error.message}`);
        }
    }

});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
