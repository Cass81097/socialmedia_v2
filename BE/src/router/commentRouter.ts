import { Router } from "express";
import commentController from "../controller/commentController";
export const commentRouter = Router();

commentRouter.get("/statusId/:id", commentController.findAll)
commentRouter.post("", commentController.addComment);
commentRouter.delete('/commentId/:id',commentController.deleteComment)
commentRouter.put('/commentId/:id',commentController.update)