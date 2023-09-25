import {AppDataSource} from "../data-source";
// import {Comment} from "../entity/comment"
import {FriendNotification} from "../entity/friendNotification";

export class FriendNotificationService {
    private FriendNotificationRepository;

    constructor() {
        this.FriendNotificationRepository = AppDataSource.getRepository(FriendNotification)
    }

    getNotificationForReceiver = async (id) => {
        try {
            return await this.FriendNotificationRepository.find({
                relations: {
                    receiver: true,
                    sender: true,
                },
                where: {
                    receiver: {
                        id:  id
                    }
                },
            });

        } catch (e) {
            console.log(e);
            throw e;
        }
    };

    save = async (friendNotification) => {
        return await this.FriendNotificationRepository.save(friendNotification);

    };
    updateNotification = async (notificationId ) => {
        try {
            const notification = this.FriendNotificationRepository.find({
                where: {
                    id: notificationId
                }
            });
            if (!notification) {
                throw new Error('User not found');
            }

            notification.isRead = true;
            await this.FriendNotificationRepository.update(notificationId, {isRead :true});
            return "da update thannh cong";
        } catch (error) {
            throw new Error('Error updating avatar');
        }
    }


}

export default new FriendNotificationService()