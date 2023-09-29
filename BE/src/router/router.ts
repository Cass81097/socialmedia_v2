import {Router} from "express";
import {userRouter} from "./userRouter";
import {friendShipRouter} from "./friendShipRouter";
import {statusRouter} from "./statusRouter";
import {imageStatusRouter} from "./imageStatusRouter";
import {likeRouter} from "./likeRouter";
import {friendNotificationRouter} from "./friendNotificationRouter";
import {statusNotificationRouter} from "./statusNotificationRouter";
import {commentRouter} from "./commentRouter";
import {groupRouter} from "./groupRouter";
import {userGroupRouter} from "./userGroupRouter";
import statusController from "../controller/statusController";
import {statusGroupRouter} from "./statusGroupRouter";
import { groupNotificationRouter } from "./groupNotificationRouter";
const router = Router();

router.use('/users', userRouter);
router.use('/friendShips',friendShipRouter );
router.use('/status',statusRouter );
router.use('/imageStatus',imageStatusRouter );
router.use('/likes',likeRouter );
router.use('/comments',commentRouter );
router.use('/statusNotifications', statusNotificationRouter );
router.use('/friendNotifications', friendNotificationRouter );
router.use('/groupNotifications', groupNotificationRouter );
router.use('/groups',groupRouter);
router.use('/userGroups', userGroupRouter);
router.use('/statusGroups', statusGroupRouter)
export default router;