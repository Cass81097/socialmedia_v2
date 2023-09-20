import { Router } from "express";
import friendShipController from "../controller/friendShipController";
import likeService from "../service/likeService";
import likeController from "../controller/likeController";
export const likeRouter = Router();

likeRouter.get("/:id", likeController.getLikeForStatus)
likeRouter.post("/add/:statusId", likeController.addLike);
likeRouter.delete('/:statusId', likeController.deleteLike)