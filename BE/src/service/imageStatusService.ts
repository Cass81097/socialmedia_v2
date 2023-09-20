import { AppDataSource } from "../data-source";
import ImageStatus from "../entity/imageStatus";


export class ImageStatusService {
    private imageStatusRepository;

    constructor() {
        this.imageStatusRepository = AppDataSource.getRepository(ImageStatus)
    }

    add = async (image) => {
        return await this.imageStatusRepository.save(this.imageStatusRepository.create(image))
    }

    findAll = async () => {
        return await this.imageStatusRepository.find({
            relations: {
                status: true
            }
        });

    }

    findAllByStatusId = async (statusId) => {
        return await this.imageStatusRepository
            .createQueryBuilder('imageStatus')
            .select(['imageStatus.id', 'imageStatus.imageUrl'])
            .leftJoin('imageStatus.status', 'status')
            .where('status.id = :statusId', { statusId })
            .getMany();
    }

    delete = async (id) => {
        return await this.imageStatusRepository.delete(id)
    }
    update = async (id, image) => {
        return await this.imageStatusRepository.update(id, image);

    }

    deleteAllByStatusId = async (statusId) => {
        await this.imageStatusRepository
            .createQueryBuilder()
            .delete()
            .where("status.id = :statusId", { statusId })
            .execute();
    }

}
export default new ImageStatusService()
