import {AppDataSource} from "../data-source";
import {Comment} from "../entity/comment"
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

}

export default new FriendNotificationService()