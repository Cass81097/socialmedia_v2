import userGroupService from "../service/userGroupService";


export class UserGroupController {
    findByUserId = async (req, res) => {
        console.log(req.params.userId,1111)
        let data = await userGroupService.findByUserId(req.params.userId)
        res.json(data)
    }
    findByGroupId = async (req, res) => {
        let data = await userGroupService.findByGroupId(req.params.groupId)
        res.json(data)
    }
    findByUserIdAndGroupId = async (req,res)=>{
        let data = await userGroupService.findByUserIdAndGroupId(req.params.userId, req.params.groupId);
        res.json(data)
    }
    findAdminInGroup =  async (req,res)=>{
        console.log( 33333)
        let data = await userGroupService.findAdminInGroup( req.params.groupId);
        res.json(data)
    }
    findByPendingGroupId = async (req,res)=>{
        let data= await  userGroupService.findByPendingGroupId(req.params.groupId)
        res.json(data)
    }
    addUserGroup = async (req, res) => {
        const saveGroup = await userGroupService.addUserGroup(req.body);
        res.json(saveGroup);
    }

    leaveGroup = async (req, res) => {
        const del = await userGroupService.leaveGroup(req.params.id)
        res.json(del)
    }
    acceptedUserGroup = async (req, res) => {
        const saveGroup = await userGroupService.acceptedUserGroup(req.params.userGroupId);
        res.json(saveGroup);
    }
    createGroupByAdmin = async (req, res) => {
        console.log(req.params.userId,    1111)
        const saveGroup = await userGroupService.createGroupByAdmin(req.params.userId, req.body);
        res.json(saveGroup);
    }

}

export default new UserGroupController ()