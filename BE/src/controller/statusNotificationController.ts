import statusNotificationService from "../service/statusNotificationService";
import friendNotificationService from "../service/friendNotificationService";
import groupNotificationService from "../service/groupNotificationService";

export class StatusNotificationController {
    getNotificationForReceiver = async (req,res)=>{

        let data = await statusNotificationService.getNotificationForReceiver(req.params.id)
        let data2 = await friendNotificationService.getNotificationForReceiver(req.params.id)
        let data3 = await groupNotificationService.getNotificationForReceiver(req.params.id)
        let notification=[...data,...data2,...data3]
        notification.sort((a, b) => {
            const timeA = a.time.getTime();
            const timeB = b.time.getTime();
            return timeB - timeA;
        });
        res.json( notification)
    }
    addNotification = async (req, res) => {
        let data = await statusNotificationService.save(req.body)
        res.json(data);
    }
    updateNotification =async (req, res) => {
        let data = await statusNotificationService.updateNotification(req.params.id)
        res.json(data);
    }


}
export default new StatusNotificationController()