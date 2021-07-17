const Server = require("./src/config/server.config");

(()=>{
    const server = new Server();
    //Remote Server
    // server.createHttpsServer();
    
    //Local Server
    server.createHttpServer();
})();
