import likeService from "../service/likeService"

export class LikeController {
    addLike = async (req, res) => {
        let data = await likeService.save(req.params.statusId, req.body.userId)
        res.json(data);
    }

    deleteLike = async (req, res) => {
        const del = await likeService.deleteByUserIdAndStatusId(req.params.statusId, req.query.userId)
        res.json(del)

    }
    getLikeForStatus = async (req, res) => {
        const list = await likeService.getLikeForStatus(req.params.id)
        res.status(200).json(list)
    }
}
export default new LikeController()