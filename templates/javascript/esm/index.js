import Server from './src/config/server.config.js';
import dotenv from 'dotenv';

(()=>{
    
    setEnvironmentVariables();
    
    const server = new Server();
    //Remote Server
    // server.createHttpsServer();
    
    //Local Server
    server.createHttpServer();
})();

function setEnvironmentVariables() {
    dotenv.config();
}

