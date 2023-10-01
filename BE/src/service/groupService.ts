import { AppDataSource } from "../data-source";
import {Group} from "../entity/group";
import {Like} from "typeorm";
import userGroupService, {UserGroupService} from "./userGroupService";
import {UserGroup} from "../entity/userGroup";
import statusGroupService from "./statusGroupService";
import {StatusGroup} from "../entity/statusGroup";
export class GroupService {
    private groupRepository;
    private userGroupRepository;
    private statusGroupRepository;


    constructor() {
        this.groupRepository = AppDataSource.getRepository(Group)
        this.userGroupRepository = AppDataSource.getRepository(UserGroup)
        this.statusGroupRepository = AppDataSource.getRepository(StatusGroup)

    }

    findAll = async ()=>{
        let group = await this.groupRepository.find();
        for (let i = 0; i < group.length ; i++) {
            let userGroup = await userGroupService.findByGroupId(group[i].id)
            let statusGroup = await statusGroupService.findStatusGroupByGroupId(group[i].id)
            group[i]= {...group[i],userGroupCount: userGroup.length, userGroup: userGroup,statusGroup : statusGroup
            }
        }

        return group
    }
    findGroupById = async (id)=>{
        let group =  await this.groupRepository.find({
            where : {
                id: id
            }
        })
        let userGroup = await userGroupService.findByGroupId(group[0].id)
        let statusGroup = await statusGroupService.findStatusGroupByGroupId(group[0].id)
        group[0]= {...group[0],userGroupCount: userGroup.length, userGroup: userGroup,statusGroup : statusGroup
        }

        return group
    }
    findByName = async ( name) => {

        try {
            let group = await this.groupRepository.find({
                where: {
                   groupName: Like(`%${name}%`),
                }
            });
            for (let i = 0; i < group.length ; i++) {
                let userGroup = await userGroupService.findByGroupId(group[i].id)
                let statusGroup = await statusGroupService.findStatusGroupByGroupId(group[i].id)
                group[i]= {...group[i],userGroupCount: userGroup.length, userGroup: userGroup,statusGroup : statusGroup
                }            }

            return group

        } catch (error) {
            throw new Error(error);
        }
    }
    updateImage = async (groupId, image) => {
        try {
            const group = this.groupRepository.find({
                where: {
                    id: groupId
                }
            });
            if (!group) {
                throw new Error('group not found');
            }

            group.image = image;
            await this.groupRepository.update(groupId, { image: image});
            return "Thay Avatar nhóm thành công";
        } catch (error) {
            throw new Error('Error updating avatar');
        }
    }
    save = async (group) => {
        return await this.groupRepository.save(group);

    };

    delete = async (id)=>{
        await userGroupService.deleteUserByGroupId(id)
        await statusGroupService.deleteStatusByGroupId(id)
        return this.groupRepository.delete(id)
    }

}

export default new GroupService()