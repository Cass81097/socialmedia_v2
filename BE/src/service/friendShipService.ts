import { AppDataSource } from "../data-source";
import { FriendShip } from "../entity/friendShip";
import { User } from "../entity/user";
import { Not } from "typeorm";

export class FriendShipService {
    private friendRepository;
    private userRepository;

    constructor() {
        this.friendRepository = AppDataSource.getRepository(FriendShip)
        this.userRepository = AppDataSource.getRepository(User)
    }

    findAll = async () => {
        try {
            const relationships = await this.friendRepository.find({
                relations: {
                    user1: true,
                    user2: true,
                },
            });

            const result = relationships.map((relationship) => {
                const user1 = {
                    id: relationship.user1.id,
                    username: relationship.user1.username,
                };

                const user2 = {
                    id: relationship.user2.id,
                    username: relationship.user2.username,
                };

                return { user1, user2 };
            });

            return result;
        } catch (error) {
            throw new Error('Error retrieving users');
        }
    };

    findById = async (user1Id, user2Id) => {
        try {
            return await this.friendRepository.find({
                relations: {
                    user1: true,
                    user2: true
                },
                where: {
                    user1: { id: user1Id },
                    user2: { id: user2Id }
                }
            });
        } catch (error) {

            console.error("Error in findById:", error);
            throw error;
        }
    }

    findFriendByUsername = async (username) => {
        try {
            const friends = await this.friendRepository
                .createQueryBuilder("friendShip")
                .innerJoinAndSelect("friendShip.user1", "user1")
                .innerJoinAndSelect("friendShip.user2", "user2")
                .where("user1.username = :username1 AND friendShip.status = 'friend'", { username1: username })
                .orWhere("user2.username = :username2 AND friendShip.status = 'friend'", { username2: username })
                .getMany();

            const friendUsers = friends.map((friendShip) => {
                if (friendShip.user1.username === username) {
                    return friendShip.user2;
                } else {
                    return friendShip.user1;
                }
            });

            return friendUsers;
        } catch (error) {

            console.error("Error in findFriendByUsername:", error);
            throw error;
        }
    };

    findCommonFriendsByUsername = async (username1, username2) => {
        try {
          const friends1 = await this.findFriendByUsername(username1);
          const friends2 = await this.findFriendByUsername(username2);
      
          const commonFriends = friends1.filter((friend1) =>
            friends2.some((friend2) => friend2.id === friend1.id)
          );
      
          return commonFriends;
        } catch (error) {
          console.error("Error in findCommonFriendsByUsername:", error);
          throw error;
        }
      }

    sendFriendRequest = async (userId1, userId2) => {
        try {
            const data = {
                user1: { id: userId1 },
                user2: { id: userId2 },
                userSendReq: userId1,
                status: 'pending'
            };

            return await this.friendRepository.save(data);
        } catch (error) {

            console.error("Error in sendFriendRequest:", error);
            throw error;
        }
    };
    findListFriendByUser = async (id) =>{
        return await this.friendRepository
            .createQueryBuilder("friendship")
            .where("friendship.user1 = :userId OR friendship.user2 = :userId", { userId: id })
            .andWhere("friendship.status = 'friend'")
            .getMany();
    }

    cancelFriendship = async (userId1, userId2) => {
        try {
            return await this.friendRepository
                .createQueryBuilder()
                .delete()
                .where('user1.id = :userId1 AND user2.id = :userId2', {
                    userId1,
                    userId2
                })
                .execute();
        } catch (error) {

            console.error("Error in cancelFriendship:", error);
            throw error;
        }
    }

    acceptFriendRequest = async (userId1, userId2) => {
        try {
            return await this.friendRepository
                .createQueryBuilder()
                .update(FriendShip)
                .set({ status: 'friend' })
                .where('user1.id = :userId1 AND user2.id = :userId2', { userId1, userId2 })
                .execute();
        } catch (error) {

            console.error("Error in acceptFriendRequest:", error);
            throw error;
        }
    }

    blockFriend = async (userId1, userId2) => {
        try {
            const data = {
                user1: { id: userId1 },
                user2: { id: userId2 },
                userSendReq: userId1,
                status: 'block'
            };

            const existingFriendship = await this.friendRepository.findOne({
                where: [
                    { user1: { id: userId1 }, user2: { id: userId2 }, status: 'friend' },
                    { user1: { id: userId1 }, user2: { id: userId2 }, status: 'pending' },
                    { user1: { id: userId2 }, user2: { id: userId1 }, status: 'friend' },
                    { user1: { id: userId2 }, user2: { id: userId1 }, status: 'pending' }
                ]
            });

            if (existingFriendship) {
                await this.friendRepository.delete(existingFriendship.id);
            }

            return await this.friendRepository.save(data);
        } catch (error) {
            console.error("Error in blockFriend:", error);
            throw error;
        }
    };

    checkStatusByUserId = async (userId1, userId2) => {
        try {
            const friendship = await this.friendRepository.findOne({
                where: [
                    { user1: { id: userId1 }, user2: { id: userId2 } },
                    { user1: { id: userId2 }, user2: { id: userId1 } }
                ]
            });

            if (friendship) {
                return {
                    status: friendship.status,
                    userSendReq: friendship.userSendReq
                };
            }

            return null;
        } catch (error) {
            console.error("Error in checkStatusByUserId:", error);
            throw error;
        }
    };

    findBlockedUsers = async (userId) => {
        try {
            const blockedUsers = await this.friendRepository.find({
                relations: {
                    user2: true,
                    user1 : true,
                },
                where: [
                    { user1: { id: userId }, status: 'block' },
                    { user2: { id: userId }, status: 'block' },
                ],
            });

            return blockedUsers.map((friendship) => friendship.user2);
        } catch (error) {
            console.error("Error in findBlockedUsers:", error);
            throw error;
        }
    };

    findPendingFriend = async (user1Id) => {
        return await this.friendRepository.find({
            relations: {
                user1: true,
                user2: true
            },
            where: [
                { user1: { id: user1Id }, status: "pending", userSendReq: Not(user1Id) },
                { user2: { id: user1Id }, status: "pending", userSendReq: Not(user1Id)  }
            ]
        });
    };

    findFriend = async (user1Id) => {
        return await this.friendRepository.find({
            relations: {
                user1: true,
                user2: true
            },
            where: [
                { user1: { id: user1Id }, status: "friend" },
                { user2: { id: user1Id }, status: "friend"  }
            ]
        });
    };
    findBlock = async () => {
        return await this.friendRepository.find({
            relations: {
                user1: true,
                user2: true
            },
            where: [
                {  status: "block"  }
            ]
        });
    };
}
export default new FriendShipService();