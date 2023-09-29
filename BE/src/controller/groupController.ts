import groupService from "../service/groupService";

export class GroupController {
    findAll = async (req, res) => {
        let data;
        if(req.query.groupName){
            data = await groupService.findByName(req.query.groupName)
        } else {
        data = await groupService.findAll()}
        res.json(data)
    }
    findByGroupId = async (req, res) => {
        let data = await groupService.findGroupById(req.params.groupId)
        res.json(data)
    }
    addGroup = async (req, res) => {
        const saveGroup = await groupService.save(req.body);
        res.json(saveGroup);
    }

    deleteGroup = async (req, res) => {
        const del = await groupService.delete(req.params.groupId)
        res.json(del)
    }
    update = async (req, res) => {
        const data = await groupService.updateImage(req.params.groupId, req.body.image)
        res.json(data)

    }


}

export default new GroupController ()