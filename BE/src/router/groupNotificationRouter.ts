import { Router } from "express";
import groupNotificationController from "../controller/groupNotificationController";

export const groupNotificationRouter = Router();

groupNotificationRouter.get("/receiverId/:id", groupNotificationController.getNotificationForReceiver)
groupNotificationRouter.post("", groupNotificationController.addNotification);
groupNotificationRouter.put("/update/:id", groupNotificationController.updateNotification);

