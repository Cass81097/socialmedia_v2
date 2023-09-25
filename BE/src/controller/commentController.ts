import commentService from "../service/commentService";

export class CommentController {
    findAll = async (req,res)=>{
        let data = await commentService.getCommentForStatus(req.params.id)
        res.json(data)
    }
    addComment = async (req, res) => {
        const savedComment = await commentService.save(req.body);
        res.json(savedComment);
    }

    deleteComment = async (req, res) => {
        const del = await commentService.delete(req.params.id)
        res.json(del)
    }
    update =async (req,res)=>{
        console.log(req.params.id, req.body.content , 1111)
        const data = await commentService.updateContent( req.params.id, req.body.content,req.body.timeEdit )
        res.json(data)

    }
}
export default new CommentController()