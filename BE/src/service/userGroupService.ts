import {AppDataSource} from "../data-source";
import {UserGroup} from "../entity/userGroup";
import {Group} from "../entity/group";


export class UserGroupService {
    private userGroupRepository;

    private groupRepository;

    constructor() {
        this.userGroupRepository = AppDataSource.getRepository(UserGroup)
        this.groupRepository = AppDataSource.getRepository(Group)

    }


    findByUserId = async (userId) => {
        try {
            return await  this.userGroupRepository.find({
                relations: {
                    user: true,
                    group: true
                },
                where: {
                    user: { id: userId },
                    status : "accepted"
                }
            });
        } catch (error) {

            console.error("Error in findById:", error);
            throw error;
        }
    }
    findByGroupId = async (groupId) => {
        try {
            return await  this.userGroupRepository.find({
                relations: {
                    user: true,
                    group: true
                },
                where: {
                    group: { id: groupId },
                    status : "accepted"

                }
            });
        } catch (error) {

            console.error("Error in findById:", error);
            throw error;
        }
    }
    findByUserIdAndGroupId =async (groupId,userId)=>{
        return await  this.userGroupRepository.find({
            relations: {
                user: true,
                group: true
            },
            where: {
                group: { id: groupId },
               user :{id:userId}

            }
        }
        )
    }
    findByPendingGroupId = async (groupId) => {
        try {
            return await  this.userGroupRepository.find({
                relations: {
                    user: true,
                    group: true
                },
                where: {
                    group: { id: groupId },
                    status : "pending"

                }
            });
        } catch (error) {

            console.error("Error in findById:", error);
            throw error;
        }
    }
    acceptedUserGroup = async ( userGroupId) => {
        try {
            const request = this.userGroupRepository.find({
                relations: {
                    group: true,
                    sender: true
                },
                where: {
                    id: userGroupId

                }
            });
            if (!request ) {
                throw new Error('request  not found');
            }

            request .status = "accepted";
            await this.userGroupRepository.update(userGroupId, { status: "accepted" });
            return "thêm thành viên vào nhóm thành công";
        } catch (error) {
            throw new Error('Error updating content');
        }
    }
    leaveGroup = async (id)=>{
        return await this.userGroupRepository.delete(id)
    }
    deleteUserByGroupId = async (groupId)=>{
       return   await this.userGroupRepository
            .createQueryBuilder()
            .delete()
            .from(UserGroup)
            .where('groupId = :groupId', { groupId })
            .execute();

    }
    createGroupByAdmin = async (userId,newGroupData)=>{
        
        let newGroup=  await this.groupRepository.save(newGroupData);
        let data= {
            user:userId,
            group: newGroup.id,
            status: "accepted",
            role:"admin"
        }
        return await  this.userGroupRepository.save(data)
    }
    addUserGroup = async (userGroup)=>{
        return await  this.userGroupRepository.save(userGroup)
    }
}
export default new UserGroupService();