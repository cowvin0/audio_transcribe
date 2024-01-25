import express from "express";
import "dotenv/config";
import { transcribeMoises } from "./moises_api.js";
import fetch from "node-fetch";
import fs from "fs";
import TwilioSDK from "twilio";
import bodyParser from "body-parser";

const app = express();

const accountSid = process.env.TWILIO_SID; const authToken = process.env.TWILIO_TOKEN; const port = process.env.PORT; const client = TwilioSDK(accountSid, authToken);
const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
const headers = {
  'Authorization': `Basic ${basicAuth}`
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

            await client.messages
                    .create({
                        body: await transcribeMoises(),
                        from: process.env.FROM,
                        to: sender
            });

        } catch (error) {
            console.error(`Error handling media from ${sender}: ${error.message}`);
        }

    } else {
        console.log(`Received text message from ${sender}: ${messageBody}`);

        try {
            client.messages
                .create({
                    body: "Text message received, thanks!",
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
