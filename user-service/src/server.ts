import express, { Express } from "express";
import { Server } from "http";
import { connectDB } from "./database";
import config from "./config/config";


const app: Express = express();
let server: Server;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});