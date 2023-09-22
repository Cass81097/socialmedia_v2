import friendNotificationService from "../service/friendNotificationService";

export class FriendNotificationController {
    getNotificationForReceiver = async (req,res)=>{
        let data = await friendNotificationService.getNotificationForReceiver(req.params.id)
        res.json(data)
    }
    addNotification = async (req, res) => {
        let data = await friendNotificationService.save(req.body)
        res.json(data);
    }


}
export default new FriendNotificationController()