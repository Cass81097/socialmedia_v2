import groupNotificationService from "../service/groupNotificationService";

export class groupNotificationController {
    getNotificationForReceiver = async (req,res)=>{
        let data = await groupNotificationService.getNotificationForReceiver(req.params.id)
        res.json(data)
    }
    addNotification = async (req, res) => {
        console.log(11111)
        let data = await groupNotificationService.save(req.body)
        res.json(data);
    }
    updateNotification =async (req, res) => {
        let data = await groupNotificationService.updateNotification(req.params.id)
        res.json(data);
    }


}
export default new groupNotificationController()