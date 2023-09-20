import {Router} from "express";
import {userRouter} from "./userRouter";
import {friendShipRouter} from "./friendShipRouter";
import {statusRouter} from "./statusRouter";
import {imageStatusRouter} from "./imageStatusRouter";
import {likeRouter} from "./likeRouter";
const router = Router();

router.use('/users', userRouter);
router.use('/friendShips',friendShipRouter );
router.use('/status',statusRouter );
router.use('/imageStatus',imageStatusRouter );
router.use('/likes',likeRouter );
export default router;