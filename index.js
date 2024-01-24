// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "AC0de8fb7793202fdf341f41d7515ae8a6";
const authToken = "5e80ea55e9ef0843ffa15891947452d2";
const client = require('twilio')(accountSid, authToken);
const fs = require('fs');

// Ler transcrição do audio e armazenar em uma variavel


// Lê o resultado do arquivo "Output 1.json"
const resultFilePath = 'Steams/track/Output 1.json';
const resultData = JSON.parse(fs.readFileSync(resultFilePath, 'utf-8'));

console.log(resultData[0].text);





