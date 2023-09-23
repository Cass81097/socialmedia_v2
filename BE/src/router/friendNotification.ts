import { Router } from "express";
import friendNotificationController from "../controller/friendNotificationController";
import statusNotificationController from "../controller/statusNotificationController";
import {statusNotificationRouter} from "./statusNotificationRouter";
export const friendNotificationRouter = Router();

friendNotificationRouter.get("/receiverId/:id", friendNotificationController.getNotificationForReceiver)
friendNotificationRouter.post("", friendNotificationController.addNotification);
friendNotificationRouter.put("/update/:id", friendNotificationController.updateNotification);

