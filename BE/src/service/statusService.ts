import { AppDataSource } from "../data-source";
import { User } from "../entity/user";
import { Status } from "../entity/status";
import imageStatusService from "./imageStatusService";
import likeService from "./likeService";
import { Like } from "typeorm";
import commentService from "./commentService";
export class StatusService {
    private statusRepository;

    constructor() {
        this.statusRepository = AppDataSource.getRepository(Status)
    }

    add = async (status) => {
        return await this.statusRepository.save(status)
    }

    findAll = async () => {
        let status = await this.statusRepository.find({
            relations: {
                receiver: true,
                sender: true,

            }
        });

        for (let i = 0; i < status.length; i++) {
            let imageByStatusId = await imageStatusService.findAllByStatusId(status[i].id);
            let likeByStatusId = await likeService.getLikeForStatus(status[i].id)
            let cmtCount = await commentService.getCommentForStatus(status[i].id)

            status[i] = await {
                ...status[i],
                image: [...imageByStatusId],
                accountLike: likeByStatusId.likeCount,
                commentCount: cmtCount,
                listUserLike: [...likeByStatusId.likeRecords],

            };
        }

        return status;
    };
    findAllByFiends = async (user1,user2) => {
        let status = await this.statusRepository.find({
            relations: {
                receiver: true,
                sender: true,
                friend_ship : true,
                user : true

            }, where:{
                friend_ship: {
                    user1Id : user1,
                    user2Id : user2,
                    // status : "friend"
                }
            }
        });

        for (let i = 0; i < status.length; i++) {
            let imageByStatusId = await imageStatusService.findAllByStatusId(status[i].id);
            let likeByStatusId = await likeService.getLikeForStatus(status[i].id)
            let cmtCount = await commentService.getCommentForStatus(status[i].id)

            status[i] = await {
                ...status[i],
                image: [...imageByStatusId],
                accountLike: likeByStatusId.likeCount,
                commentCount: cmtCount,
                listUserLike: [...likeByStatusId.likeRecords],

            };
        }

        return status;
    };


    findStatusByIdUser = async (senderId, receiverId) => {
        let status = await this.statusRepository.find({
            relations: {
                receiver: true,
                sender: true
            },
            where: {
                sender: {
                    id: senderId
                },
                receiver: {
                    id: receiverId
                }
            }
        });

        for (let i = 0; i < status.length; i++) {
            let imageByStatusId = await imageStatusService.findAllByStatusId(status[i].id);
            let likeByStatusId = await likeService.getLikeForStatus(status[i].id);
            let cmtCount = await commentService.getCommentForStatus(status[i].id)

            status[i] = {
                ...status[i],
                image: [...imageByStatusId],
                accountLike: likeByStatusId.likeCount,
                listUserLike: [...likeByStatusId.likeRecords],
                commentCount: cmtCount
            };
        }

        return status;
    };

    findByIdUser = async (id) => {
        let status = await this.statusRepository.find({
            relations: {
                receiver: true,
                sender: true
            },
            where: {
                receiver: {
                    id: id
                }
            },
            order: {
                time: 'DESC'
            }
        });


        for (let i = 0; i < status.length; i++) {
            let imageByStatusId = await imageStatusService.findAllByStatusId(status[i].id);
            let likeByStatusId = await likeService.getLikeForStatus(status[i].id);
            let cmtCount = await commentService.getCommentForStatus(status[i].id)
            status[i] = {
                ...status[i],
                image: [...imageByStatusId],
                accountLike: likeByStatusId.likeCount,
                listUserLike: [...likeByStatusId.likeRecords],
                commentCount: cmtCount
            };
        }

        return status;
    };

    findStatusByUserSender = async (userId) => {
        let status = await this.statusRepository.find({
            relations: {
                receiver: true,
                sender: true
            },
            where: {
                sender: {
                    id: userId
                }
            },
            order: {
                time: 'DESC'
            }
        });
        for (let i = 0; i < status.length; i++) {
            let imageByStatusId = await imageStatusService.findAllByStatusId(status[i].id);
            let likeByStatusId = await likeService.getLikeForStatus(status[i].id);
            let cmtCount = await commentService.getCommentForStatus(status[i].id)
            status[i] = {
                ...status[i],
                image: [...imageByStatusId],
                accountLike: likeByStatusId.likeCount,
                listUserLike: [...likeByStatusId.likeRecords],
                commentCount: cmtCount
            };
        }
        return status;
    };

    findByIdAndStatus = async (id) => {

        let status = await this.statusRepository.find({
            relations: {
                receiver: true,
                sender: true
            },
            where: [
                {
                    receiver: {
                        id: id
                    },
                    visibility: "public"
                },
                {
                    receiver: {
                        id: id
                    },
                    visibility: "friend"
                },
            ],
            order: {
                time: 'DESC'
            }
        });


        for (let i = 0; i < status.length; i++) {
            let imageByStatusId = await imageStatusService.findAllByStatusId(status[i].id);
            let likeByStatusId = await likeService.getLikeForStatus(status[i].id);
            let cmtCount = await commentService.getCommentForStatus(status[i].id)

            status[i] = {
                ...status[i],
                image: [...imageByStatusId],
                accountLike: likeByStatusId.likeCount,
                listUserLike: [...likeByStatusId.likeRecords],
                commentCount: cmtCount

            };
        }

        return status;
    };

    findByIdAndStatusPublic = async (id) => {
        let status = await this.statusRepository.find({
            relations: {
                receiver: true,
                sender: true
            },
            where: [
                {
                    receiver: {
                        id: id
                    },
                    visibility: "public"
                },
            ],
            order: {
                time: 'DESC'
            }
        });

        for (let i = 0; i < status.length; i++) {
            let imageByStatusId = await imageStatusService.findAllByStatusId(status[i].id);
            let likeByStatusId = await likeService.getLikeForStatus(status[i].id);
            let cmtCount = await commentService.getCommentForStatus(status[i].id)

            status[i] = {
                ...status[i],
                image: [...imageByStatusId],
                accountLike: likeByStatusId.likeCount,
                listUserLike: [...likeByStatusId.likeRecords],
                commentCount: cmtCount

            };
        }

        return status;
    };


    delete = async (statusId) => {
        try {
            await this.statusRepository.createQueryBuilder()
                .delete()
                .from("like")
                .where("statusId = :statusId", { statusId })
                .execute(); await this.statusRepository.createQueryBuilder()
                    .delete()
                    .from("comment")
                    .where("statusId = :statusId", { statusId })
                    .execute();

            await this.statusRepository.createQueryBuilder()
                .delete()
                .from("image_status")
                .where("statusId = :statusId", { statusId })
                .execute();

            await this.statusRepository.createQueryBuilder()
                .delete()
                .from("status")
                .where("id = :statusId", { statusId })
                .execute();

            return "xoá thành  công";

        } catch (error) {
            console.error('Lỗi khi xóa bài viết:', error.message);
            throw error;
        }
    }

    updateVisibility = async (statusId, visibility) => {
        try {
            const status = this.statusRepository.find({
                relations: {
                    receiver: true,
                    sender: true
                },
                where: {
                    id: statusId
                }
            });
            if (!status) {
                throw new Error('User not found');
            }

            status.visibility = visibility;
            await this.statusRepository.update(statusId, { visibility: visibility });
            return "Thay trạng thái thành công";
        } catch (error) {
            throw new Error('Error updating trạng thái');
        }
    }
    updateContent = async (statusId, content) => {
        try {
            const status = this.statusRepository.find({
                relations: {
                    receiver: true,
                    sender: true
                },
                where: {
                    id: statusId
                }
            });
            if (!status) {
                throw new Error('User not found');
            }

            status.content = content;
            await this.statusRepository.update(statusId, { content: content });
            return "Thay Noi dung Status thành công";
        } catch (error) {
            throw new Error('Error updating content');
        }
    }
    findByContent = async (id, content) => {

        try {
            let status = await this.statusRepository.find({
                relations: {
                    receiver: true,
                    images: true,
                    sender: true
                },
                where: {
                    content: Like(`%${content}%`),
                    sender: { id: id }
                }
            });
            for (let i = 0; i < status.length; i++) {
                let likeByStatusId = await likeService.getLikeForStatus(status[i].id);
                let cmtCount = await commentService.getCommentForStatus(status[i].id)


                status[i] = {
                    ...status[i],
                    accountLike: likeByStatusId.likeCount, listUserLike: [...likeByStatusId.likeRecords],
                    commentCount: cmtCount

                };
            }
            return status

        } catch (error) {
            throw new Error(error);
        }
    }

    findStatusById = async (id) => {
        try {
            const list = await this.statusRepository.find({
                relations: {
                    receiver: true,
                    sender: true
                },

                where: {
                    id: id
                }
            });
            for (let i = 0; i < list.length; i++) {
                let likeByStatusId = await likeService.getLikeForStatus(list[i].id);
                let cmtCount = await commentService.getCommentForStatus(list[i].id)


                list[i] = {
                    ...list[i],
                    accountLike: likeByStatusId.likeCount, listUserLike: [...likeByStatusId.likeRecords],
                    commentCount: cmtCount

                };
            }
            return list
        } catch (error) {
            throw new Error('Error finding user by ID');
        }
    }

}
export default new StatusService()