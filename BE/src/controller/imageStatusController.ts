
import ImageStatusService from "../service/imageStatusService";
import statusService from "../service/statusService";

export class ImageStatusController {

    findAll = async (req, res) => {
        let data = await ImageStatusService.findAll()
        res.json(data)
    }

    add = async (req, res) => {
        let data = await ImageStatusService.add(req.body);
        res.json(data)
    }
    update = async (req, res) => {
        let data = await ImageStatusService.update(req.params.id, req.body);
        res.json(data)
    }
    delete = async (req, res) => {
        let data = await ImageStatusService.delete(req.params.id);
        res.json(data)
    }

    deleteAllByStatusId = async (req, res) => {
        let data = await ImageStatusService.deleteAllByStatusId(req.params.statusId);
        res.json(data)
    }

    findAllByStatusId =async (req, res)=>{
        let data = await ImageStatusService.findAllByStatusId(req.params.id)       
        res.json(data);
    }
}
export default new ImageStatusController()