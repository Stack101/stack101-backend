const app = require("./app");
const http = require("http");

const server = http.createServer(app);
const port = process.env.PORT || 3030;

server.listen(port, () => {
  console.log("Listening to port " + port);
});
