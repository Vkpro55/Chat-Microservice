import { Router } from "express";
import MessageController from "../controllers/MessageController";
import { authMiddleware } from "../middleware";

const messageRoutes = Router();

/**
 * 
 */
messageRoutes.post("/send", authMiddleware as any, MessageController.send as any);


export default messageRoutes;
