import {AppDataSource} from "../data-source";
import {GroupNotification} from "../entity/groupNotification";
import userGroupService from "./userGroupService";


export class GroupNotificationService {
    private GroupNotificationRepository;

    constructor() {
        this.GroupNotificationRepository = AppDataSource.getRepository(GroupNotification)
    }

    getNotificationForReceiver = async (adminId) => {
        try {
            return await this.GroupNotificationRepository .find({
                relations: {
                    receiver: true,
                    sender: true,
                    group:true,
                },
                where: {
                    receiver: {
                        id:  adminId
                    }
                },
            });

        } catch (e) {
            console.log(e);
            throw e;
        }
    };

    save = async (groupNotification) => {
        return await this.GroupNotificationRepository.save(groupNotification);

    };
    updateNotification = async (notificationId ) => {
        try {
            const notification = this.GroupNotificationRepository.find({
                where: {
                    id: notificationId
                }
            });
            if (!notification) {
                throw new Error('User not found');
            }

            notification.isRead = true;
            await this.GroupNotificationRepository.update(notificationId, {isRead :true});
            return "da update thannh cong";
        } catch (error) {
            throw new Error('Error updating avatar');
        }
    }


}

export default new GroupNotificationService()