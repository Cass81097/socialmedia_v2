import { AppDataSource } from "../data-source";
import {Comment} from "../entity/comment"
export class CommentService {
    private commentRepository;

    constructor() {
        this.commentRepository = AppDataSource.getRepository(Comment)
    }

    getCommentForStatus = async (id) => {
        try {
            const commentRecords = await this.commentRepository.find({
                where: {
                    status: {
                        id: id
                    }
                },
                relations: {
                    user: true
                }
            })

            const commentCount = commentRecords.length
            return { commentRecords: commentRecords, commentCount: commentCount }
        } catch (e) {
            console.log(e)
        }
    }

    save = async (comment) => {
        return await this.commentRepository.save(comment);

    };
    updateContent = async (commentId, content) => {
        try {
            const comment = this.commentRepository.find({
                relations: {
                    user: true,
                },
                where: {
                    id: commentId
                }
            });
            if (!commentId) {
                throw new Error('Comment not found');
            }
            comment.content = content;
            await this.commentRepository.update(commentId, { content: content });
            return "Thay Noi dung Comment thành công";
        } catch (error) {
            throw new Error('Error updating content');
        }
    }
    delete = async (id)=>{
        return this.commentRepository.delete(id)
    }

}

export default new CommentService()