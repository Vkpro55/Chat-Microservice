 
import { Server } from "http";
import app from "./app";
import { connectDB } from "./database";
import config from "./config/config";

let server: Server;
connectDB();

server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

