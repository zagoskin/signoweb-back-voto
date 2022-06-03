require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models/index');


db.sequelize.sync();
// const routes = require('./routes');
const server = express();

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));


// server.use('/api',routes);
server.get('/', (req, res) => {
  res.json({ message: "Welcome to node app by Porto Juan"});
})

require('./routes/enquete.routes')(server);
require('./routes/opcao.routes')(server);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});