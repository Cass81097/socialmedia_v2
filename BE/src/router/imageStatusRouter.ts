import {Router} from "express";
import statusController from "../controller/statusController";
import imageController from "../controller/imageStatusController";

export const imageStatusRouter = Router();
imageStatusRouter.delete("/:id", imageController.delete);
imageStatusRouter.post("", imageController.add);
imageStatusRouter.put("/:id", imageController.update);
imageStatusRouter.get("/:id", imageController.findAllByStatusId);
imageStatusRouter.get("/", imageController.findAll);    

imageStatusRouter.delete("/delete/:statusId", imageController.deleteAllByStatusId);
