const Server = require("./config/server.config.js");
const dotenv = require("dotenv");

(()=>{
    setEnvironmentVariables();
    
    const server = new Server();
    
    //Remote Server - HTTPS
    // server.createHttpsServer();
    
    //Local Server
    server.createHttpServer();
})();

function setEnvironmentVariables() {
    dotenv.config();
}

