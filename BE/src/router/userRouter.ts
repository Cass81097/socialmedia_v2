import {Router} from "express";
import userController from "../controller/userController";
export const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.put('/users/:id', userController.update);
userRouter.get('/', userController.findAll);
userRouter.get('/find/:username', userController.findByUserName);
userRouter.get('/username', userController.findAllUserName);
userRouter.get('/find/email/:email', userController.findByEmail);
userRouter.get('/find/name/:name', userController.findUserByName);
userRouter.get('/find/id/:id', userController.findUserById);

userRouter.put('/avatar/:id', userController.updateAvatar);
userRouter.put('/cover/:id', userController.updateCover);

// update password
userRouter.put("/:id",userController.updatePassword)