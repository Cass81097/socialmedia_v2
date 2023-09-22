import {Router} from "express";
import {userRouter} from "./userRouter";
import {friendShipRouter} from "./friendShipRouter";
import {statusRouter} from "./statusRouter";
import {imageStatusRouter} from "./imageStatusRouter";
import {likeRouter} from "./likeRouter";
import {friendNotificationRouter} from "./friendNotification";
import {statusNotificationRouter} from "./statusNotificationRouter";
import {commentRouter} from "./commentRouter";
const router = Router();

router.use('/users', userRouter);
router.use('/friendShips',friendShipRouter );
router.use('/status',statusRouter );
router.use('/imageStatus',imageStatusRouter );
router.use('/likes',likeRouter );
router.use('/comments',commentRouter );
router.use('/statusNotifications', statusNotificationRouter );
router.use('/friendNotifications', friendNotificationRouter );
export default router;