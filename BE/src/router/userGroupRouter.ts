import { Router } from "express";
import userGroupController from "../controller/userGroupController";

export const userGroupRouter = Router();
userGroupRouter.get("/find-admin/:groupId", userGroupController.findAdminInGroup)

userGroupRouter.get("/userId/:userId", userGroupController.findByUserId)
userGroupRouter.get("/groupId/:groupId", userGroupController.findByGroupId)
userGroupRouter.get("/pending-groupId/:groupId", userGroupController.findByPendingGroupId)
userGroupRouter.get("/userId/:userId/groupId/:groupId", userGroupController.findByUserIdAndGroupId)
userGroupRouter.post("", userGroupController.addUserGroup);
userGroupRouter.delete('/userId/:id',userGroupController.leaveGroup)
userGroupRouter.put('/accept/:userGroupId',userGroupController.acceptedUserGroup);
userGroupRouter.post('/create-group/:userId',userGroupController.createGroupByAdmin);

