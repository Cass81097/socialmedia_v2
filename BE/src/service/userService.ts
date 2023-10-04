import { User } from "../entity/user";
import { AppDataSource } from "../data-source";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET } from "../middleware/jwt";
import { Like } from "typeorm";

export class UserService {
    private userRepository;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User)
    }

    findAll = async () => {
        try {
            return await this.userRepository.find();
        } catch (error) {
            throw new Error('Error retrieving users');
        }
    }

    findAllUserName = async () => {
        try {
            const users = await this.userRepository.find();
            return users.map((user) => user.username);
        } catch (error) {
            throw new Error('Error retrieving usernames');
        }
    }

    update = async (id, user) => {
        try {
            return await this.userRepository.update(id, user);
        } catch (error) {
            throw new Error('Error updating user');
        }
    }

    register = async (user) => {
        try {
            const existingUser = await this.userRepository.findOneBy({ email: user.email });
            if (existingUser) {
                return 'User already exists';
            }
            user.password = await bcrypt.hash(user.password, 10);
            user.passwordConfirm = user.password;
            return this.userRepository.save(user);
        } catch (error) {
            throw new Error('Error registering user');
        }
    }

    findByUserName = async (username) => {
        try {
            return await this.userRepository.find({
                where: {
                    username: Like(`${username}`)
                }
            });
        } catch (error) {
            throw new Error('Error finding user by username');
        }
    }

    findByName = async (username) => {
        try {
            return await this.userRepository.find({
                where: {
                    username: Like(`%${username}%`)
                }
            });
        } catch (error) {
            throw new Error('Error finding user by name');
        }
    }

    findByEmail = async (email) => {
        try {
            return this.userRepository.find({
                where: {
                    email: email
                }
            });
        } catch (error) {
            throw new Error('Error finding user by email');
        }
    }

    findUserById = async (id) => {
        try {
            return await this.userRepository.find({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw new Error('Error finding user by ID');
        }
    }

    updateAvatar = async (userId, avatar) => {
        try {
            const user = this.userRepository.find({
                where: {
                    id: userId
                }
            });
            if (!user) {
                throw new Error('User not found');
            }

            user.avatar = avatar;
            await this.userRepository.update(userId, { avatar: avatar });
            return "Thay Avatar thành công";
        } catch (error) {
            throw new Error('Error updating avatar');
        }
    }

    updateCover = async (userId, cover) => {
        try {
            const user = this.userRepository.find({
                where: {
                    id: userId
                }
            });
            if (!user) {
                throw new Error('User not found');
            }

            user.cover = cover;
            await this.userRepository.update(userId, { cover: cover });
            return "Thay Cover thành công";
        } catch (error) {
            throw new Error('Error updating cover');
        }
    }

    updatePassword = async (userId, oldPassword, newPassword) => {
        try {
            console.log("oldPass", oldPassword);
            console.log("newPass", newPassword);
            const user = await this.findUserById(userId);
            console.log(user, "userService");
            if (!user) {
                throw new Error('Không tìm thấy người dùng.');
            }
            console.log(user[0].password);
            const isPasswordValid = await bcrypt.compare(oldPassword, user[0].password);

            if (!isPasswordValid) {
                throw new Error('Mật khẩu cũ không đúng.');
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedNewPassword;

            await this.userRepository.update(userId, { password: hashedNewPassword });

            return "Mật khẩu đã được cập nhật";
        } catch (error) {
            if (error.message === 'Mật khẩu cũ không đúng.') {
                return error.message
                // Xử lý trường hợp mật khẩu cũ không đúng ở đây
                // Ví dụ: trả về một mã lỗi hoặc thông báo lỗi cụ thể
            } else {
                // Xử lý các lỗi khác (ví dụ: lỗi khi không tìm thấy người dùng hoặc lỗi bcrypt)
                throw new Error('Lỗi khi cập nhật mật khẩu');
            }
        }
    }

    checkUser = async (user) => {
        try {
            let userFind = await this.userRepository.findOneBy({ email: user.email });
            if (!userFind) {
                return 'Emailkhông tồn tại';
            } else {
                let passWordCompare = await bcrypt.compare(user.password, userFind.password);
                console.log(passWordCompare);
                if (passWordCompare) {
                    let payload = {
                        id: userFind.id,
                        email: userFind.email,
                        role: 'admin'
                    };
                    return {
                        token: jwt.sign(payload, SECRET, {
                            expiresIn: 36000 * 10 * 100
                        }),
                        id: userFind.id,
                        fullname: userFind.fullname,
                        email: userFind.email,
                        username: userFind.username,
                        password: userFind.password,
                        status: userFind.status,
                        avatar: userFind.avatar,
                        cover: userFind.cover,
                        gender: userFind.gender
                    };
                } else {
                    return 'Mật khẩu không đúng';
                }
            }
        } catch (error) {
            throw new Error('Error checking user');
        }
    }
}

export default new UserService()