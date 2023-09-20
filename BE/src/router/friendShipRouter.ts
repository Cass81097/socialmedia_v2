import {Router} from "express";
import friendShipController from "../controller/friendShipController";
export const friendShipRouter = Router();


friendShipRouter.post('/request/:userId1/:userId2', friendShipController.sendFriendRequest);
friendShipRouter.post('/accept/:userId1/:userId2',friendShipController.acceptFriendRequest);

friendShipRouter.post('/findId', friendShipController.findById);
friendShipRouter.get('/checkStatusByUserId/:userId1/:userId2', friendShipController.checkStatusByUserId);
friendShipRouter.post('/block/:userId1/:userId2', friendShipController.blockFriend);
friendShipRouter.get('/blocklist/:id', friendShipController.getBlockList);
friendShipRouter.post('/unfriend/:userId1/:userId2', friendShipController.cancelFriendship);

friendShipRouter.get('/listFriend/username/:username', friendShipController.findFriendByUsername);
// friendShipRouter.get('/listFriend/id/:id', friendShipController.findFriendById);
friendShipRouter.get('/commonFriend/username/:username1/:username2', friendShipController.findCommonFriendsByUsername);

friendShipRouter.get('/', friendShipController.findAll);
// friendShipRouter.get('/listFriend/id/:user1Id', friendShipController.findFriend);