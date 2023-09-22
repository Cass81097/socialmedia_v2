import { Router } from "express";
import statusNotificationController from "../controller/statusNotificationController";
export const statusNotificationRouter = Router();

statusNotificationRouter.get("/receiverId/:id", statusNotificationController.getNotificationForReceiver)
statusNotificationRouter.post("", statusNotificationController.addNotification);
