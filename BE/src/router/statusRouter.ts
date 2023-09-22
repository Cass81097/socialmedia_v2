import {Router} from "express";
import statusController from "../controller/statusController";
import userController from "../controller/userController";
import {userRouter} from "./userRouter";

export const statusRouter = Router();
statusRouter.get("/", statusController.findAll);
statusRouter.get("/:id", statusController.findAllByIdUser);
statusRouter.delete("/:id", statusController.delete);
statusRouter.post("", statusController.add);
statusRouter.put('/content/:id', statusController.updateContent);
statusRouter.put('/visibility/:id', statusController.updateVisibility);
statusRouter.get("/id/:senderId/:receiverId", statusController.findStatusByIdUser);

statusRouter.get("/content/:userId",statusController.findByContent)

statusRouter.get("/visibility/:userId", statusController.findByIdAndStatus);
statusRouter.get("/visibility/public/:userId", statusController.findByIdAndStatusPublic);

statusRouter.get('/find/idStatus/:id', statusController. findByStatusId );