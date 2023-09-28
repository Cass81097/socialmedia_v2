import {StatusGroup} from "../entity/statusGroup";
import {AppDataSource} from "../data-source";
import {UserGroup} from "../entity/userGroup";

export class StatusGroupService {
    private statusGroupRepository;

    constructor() {
        this.statusGroupRepository = AppDataSource.getRepository(StatusGroup)
    }



    findAll = async () => {
        let status = await this.statusGroupRepository.find({
            relations: {
                group: true,
                sender: true
            }
        });
        return status;
    };

    findStatusGroupByGroupId = async (GroupId) => {
        let status = await this.statusGroupRepository.find({
            relations: {
                group: true,
                sender: true
            },
            where: {
                group: {
                    id: GroupId
                }
            }
        });

        return status;
    };

    findStatusGroupByGroupIdAndSenderId = async (groupId, senderId)=>{
        let status = await this.statusGroupRepository.find({
            relations: {
                group: true,
                sender: true
            },
            where: {
                group: {
                    id: groupId
                },
                sender:{
                    id: senderId
                }
            }
        });

        return status;
    }
    addStatusGroup = async (statusGroup) => {
        return await this.statusGroupRepository.save(statusGroup)
    }
    delete = async (id) => {
        return await this.statusGroupRepository.delete(id)

    }
    deleteStatusByGroupId = async (groupId)=>{
        return   await this.statusGroupRepository
            .createQueryBuilder()
            .delete()
            .from(StatusGroup)
            .where('groupId = :groupId', { groupId })
            .execute();

    }
    updateContent = async (statusId, content) => {
        try {
            const status = this.statusGroupRepository.find({
                relations: {
                    group: true,
                    sender: true
                },
                where: {
                    id: statusId
                }
            });
            if (!status) {
                throw new Error('status not found');
            }

            status.content = content;
            await this.statusGroupRepository.update(statusId, { content: content });
            return "Thay Noi dung Status thành công";
        } catch (error) {
            throw new Error('Error updating content');
        }
    }

}
export default new StatusGroupService()