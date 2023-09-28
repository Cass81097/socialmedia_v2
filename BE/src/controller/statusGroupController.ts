import statusGroupService from "../service/statusGroupService";

export class StatusGroupController {
    findAll = async (req, res) => {
        let data = await statusGroupService.findAll()
        res.json(data)
    }
    findStatusGroupByGroupId = async (req, res) => {
        let data = await statusGroupService.findStatusGroupByGroupId(req.params.groupId)
        res.json(data)
    }
    findStatusGroupByGroupIdAndSenderId = async (req, res) => {
        let data = await statusGroupService.findStatusGroupByGroupIdAndSenderId(req.params.groupId,req.params.senderId)
        res.json(data)
    }

    addStatusGroup = async (req, res) => {
        const savedComment = await statusGroupService.addStatusGroup(req.body);
        res.json(savedComment);
    }

    deleteStatusGroup = async (req, res) => {
        const del = await statusGroupService.delete(req.params.idStatusGroup)
        res.json(del)
    }
    updateContent = async (req, res) => {
        const data = await statusGroupService.updateContent(req.params.statusId, req.body.content)
        res.json(data)

    }
}

export default new StatusGroupController()