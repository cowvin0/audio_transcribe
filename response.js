// //https://timberwolf-mastiff-9776.twil.io/demo-reply


// require('dotenv').config();
// const express = require('express');

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.get('/', (req, res) => {

// app.listen(process.env.PORT || 3000, () => {
//     console.log('Server started');
// });

// getWebhookData.js
// response.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; // Escolha a porta que desejar

// Configuração do middleware para analisar o corpo da solicitação como JSON
app.use(bodyParser.json());

// Rota para lidar com solicitações POST no endpoint do webhook
app.post('/webhook', (req, res) => {
  // Obtenha os dados da solicitação
  const data = req.body;

  // Faça o que desejar com os dados aqui
  console.log('Dados recebidos do Twilio:', data);

  // Envie uma resposta ao Twilio (opcional)
  res.status(200).end();
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});
