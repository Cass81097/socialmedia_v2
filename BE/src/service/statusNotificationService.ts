import { AppDataSource } from "../data-source";
import {StatusNotification} from "../entity/statusNotification";

export class StatusNotificationService {
    private StatusNotificationRepository;

    constructor() {
        this.StatusNotificationRepository = AppDataSource.getRepository(StatusNotification)
    }

    getNotificationForReceiver = async (userId) => {
        try {
            const notifications = await this.StatusNotificationRepository
                .createQueryBuilder("statusNotification")
                .leftJoinAndSelect("statusNotification.status", "status")
                .leftJoinAndSelect("statusNotification.sender", "sender")
                .leftJoinAndSelect("status.receiver", "receiver")
                .leftJoinAndSelect("status.sender", "statusSender")
                .where("statusSender.id = :userId")
                .orWhere("receiver.id = :userId")
                .setParameter("userId", userId)
                .getMany();

            return notifications;
        } catch (e) {
            console.log(e);
            throw e;
        }
    };
    save = async (friendNotification) => {
        return await this.StatusNotificationRepository.save(friendNotification);

    };

}

export default new StatusNotificationService()