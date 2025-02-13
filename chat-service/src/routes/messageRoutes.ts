import { Router } from "express";
import MessageController from "../controllers/MessageController";
import { authMiddleware } from "../middleware";

const messageRoutes = Router();

/**
 *@route -> POST: "/send"
 *@body -> { "receiverId": "socketId", "message": "Hello there!" }
 */
messageRoutes.post("/send", authMiddleware as any, MessageController.send as any);

/**
 *@route -> GET: "/get/:socketId"
 */
messageRoutes.get(
    "/get/:receiverId",
    authMiddleware as any,
    MessageController.getConversation as any
);


export default messageRoutes;
