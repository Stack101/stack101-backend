const http = require('http');
const app = require('./app');
const winston = require('./config/winston');

const server = http.createServer(app);
const port = process.env.PORT || 3030;

server.listen(port, () => {
  winston.info(`Listening to port ${port}`);
});
