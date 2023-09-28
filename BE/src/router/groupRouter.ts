import { Router } from "express";
import groupController from "../controller/groupController";
export const groupRouter = Router();

groupRouter.get("", groupController.findAll)
groupRouter.post("", groupController.addGroup);
groupRouter.get("/:groupId", groupController.findByGroupId)
groupRouter.delete('/:groupId',groupController.deleteGroup)
groupRouter.put('/:groupId',groupController.update)