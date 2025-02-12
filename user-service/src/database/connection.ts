import mongoose from "mongoose";
import config from "../config/config";

export const connectDB = async () => {
    try {
        const URI = `mongodb+srv://${config.MONGO_USERNAME}:${config.MONGO_PASS}@cluster0.rkdaw.mongodb.net/Chat_App_Microservice?retryWrites=true&w=majority&appName=Cluster0`
        await mongoose.connect(URI!);
        console.info("Database connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
