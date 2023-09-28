import {Router} from "express";
import statusGroupController from "../controller/statusGroupController";
import userController from "../controller/userController";
import {userRouter} from "./userRouter";

export const statusGroupRouter = Router();

statusGroupRouter.get("/", statusGroupController.findAll);
statusGroupRouter.get("/groupId/:groupId", statusGroupController.findStatusGroupByGroupId);
statusGroupRouter.get("/groupId-senderId/:groupId/:senderId", statusGroupController.findStatusGroupByGroupIdAndSenderId);
statusGroupRouter.post("", statusGroupController.addStatusGroup )
statusGroupRouter.put ("/update-content/:statusId", statusGroupController.updateContent )
statusGroupRouter.delete ("/:idStatusGroup", statusGroupController.deleteStatusGroup )