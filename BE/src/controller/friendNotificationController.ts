import friendNotificationService from "../service/friendNotificationService";
import statusNotificationService from "../service/statusNotificationService";

export class FriendNotificationController {
    getNotificationForReceiver = async (req,res)=>{
        let data = await friendNotificationService.getNotificationForReceiver(req.params.id)
        res.json(data)
    }
    addNotification = async (req, res) => {
        let data = await friendNotificationService.save(req.body)
        res.json(data);
    }
    updateNotification =async (req, res) => {
        let data = await friendNotificationService.updateNotification(req.params.id)
        res.json(data);
    }


}
export default new FriendNotificationController()