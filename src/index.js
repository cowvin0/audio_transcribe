import express from "express";
import "dotenv/config";
import TwilioSDK from "twilio";

const app = express();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = TwilioSDK(accountSid, authToken);



client.messages
      .create({
         from: process.env.FROM,
         body: 'Hello there!',
         to: 'whatsapp:+558386136318'
       })
      .then(message => console.log(message.sid));
