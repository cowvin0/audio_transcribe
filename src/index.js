import "dotenv/config"

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
      .create({
         from: process.env.FROM,
         body: 'Hello there!',
         to: 'whatsapp:+558386136318'
       })
      .then(message => console.log(message.sid));
