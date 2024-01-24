import express from "express";
import axios from "axios";
import "dotenv/config";
import ffmpeg from "@ffmpeg-installer/ffmpeg";
import TwilioSDK from "twilio";
import "fluent-ffmpeg";
import FfmpegCommand from "fluent-ffmpeg";
import "fs";
import bodyParser from "body-parser";
const app = express();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const port = process.env.PORT;
const client = TwilioSDK(accountSid, authToken);

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.get("/", (req, res) => {
    res.send("Hello, this is the root route");
})

app.post("/webhook", (req, res) => {
    const messageBody = req.body.Body;
    const sender = req.body.From;
    const mediaUrl = req.body.MediaUrl0;

    if (req.body.NumMedia > 0) {
        const mediaUrl = req.body.MediaUrl0;
        console.log(`Received audio message from ${sender}. Media URL: ${mediaUrl}`);

        try {

            // const ffmpeg = new FfmpegCommand();
            ffmpeg()
                .input(mediaUrl)
                .audioCodec("libmp3lame")
                .toFormat("mp3")
                .on("end", async () => {

                    const outputFile = "converted_audio.mp3";
                    const outputBuffer = fs.readFileSync(outputFile);

                    await client.messages
                                .create({
                                    body: "thanks",
                                    from: process.env.FROM,
                                    to: "whatsapp:+558386136318",
                                    mediaUrl: ['data:audio/mp3;base64,' + outputBuffer.toString('base64')],
                    });

                    console.log(`Sent audio response to ${sender}`);
                })
                .on("error", (err) => {
                    console.log("Error converting audio:", err)
                })
                .save("converted_audio.mp3");
        } catch (error) {
            console.error(`Error handling media from ${sender}: ${error.message}`);
        }

    }
    // console.log(`Received message from ${sender}: ${messageBody}`);
    // console.log(mediaUrl);

    // client.messages
    //       .create({
    //          from: process.env.FROM,
    //          mediaUrl: mediaUrl,
    //          body: mediaUrl,
    //          to: 'whatsapp:+558386136318'
    //        })
    //       .then(message => console.log(message.sid));

});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
