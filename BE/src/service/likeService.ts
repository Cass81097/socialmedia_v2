import { AppDataSource } from "../data-source";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET } from "../middleware/jwt";
import { Like } from "../entity/like";

export class LikeService {
    private likeRepository;

    constructor() {
        this.likeRepository = AppDataSource.getRepository(Like)
    }

    getLikeForStatus = async (id) => {
        try {
            const likeRecords = await this.likeRepository.find({
                where: {
                    status: {
                        id: id
                    }
                },
                relations: {
                    user: true
                }
            })

            const likeCount = likeRecords.length
            return { likeRecords, likeCount }
        } catch (e) {
            console.log(e)
        }
    }

    save = async (statusId, userId) => {
        const now = new Date();
        const options = { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions;
        const vnDateTime = new Intl.DateTimeFormat('en-US', options).format(now);


        try {
            const existingLike = await this.likeRepository.findOne({
                where: {
                    status: { id: statusId },
                    user: { id: userId },
                },
            });

            if (existingLike) {
                // Nếu like đã tồn tại, cập nhật giá trị isLiked thành true
                existingLike.isLiked = true;
                return await this.likeRepository.save(existingLike);
            } else {
                // Nếu like chưa tồn tại, tạo một like mới và đặt isLiked thành true
                const newLike = this.likeRepository.create({
                    status: { id: statusId },
                    user: { id: userId },
                    isLiked: true,
                    time: vnDateTime
                });

                return await this.likeRepository.save(newLike);
            }
        } catch (e) {
            console.log(e);
        }
    };
    deleteByUserIdAndStatusId = async (statusId, userId) => {
        try {
            const likeToDelete = await this.likeRepository.createQueryBuilder("like")
                .leftJoinAndSelect("like.user", "user")
                .leftJoinAndSelect("like.status", "status")
                .where("user.id = :userId", { userId })
                .andWhere("status.id = :statusId", { statusId })
                .getOne();
            console.log(likeToDelete)

            if (!likeToDelete) {

                throw new Error("Không tìm thấy like để xóa");
            }
            return await this.likeRepository.delete(likeToDelete)

        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    update = async (id, user) => {
        try {
            return await this.likeRepository.update(id, user);
        } catch (error) {
            throw new Error('Error updating user');
        }
    }
}

export default new LikeService()