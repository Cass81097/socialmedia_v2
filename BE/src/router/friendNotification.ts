import { Router } from "express";
import friendNotificationController from "../controller/friendNotificationController";
export const friendNotificationRouter = Router();

friendNotificationRouter.get("/receiverId/:id", friendNotificationController.getNotificationForReceiver)
friendNotificationRouter.post("", friendNotificationController.addNotification);
