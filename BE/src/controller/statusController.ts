import statusService from "../service/statusService";
import {Request, Response} from "express";
import userService from "../service/userService";
import {statusRouter} from "../router/statusRouter";


export class StatusController {

    findAll = async (req, res) => {
        let list = await statusService.findAll()
        res.json(list)
    }

    add = async (req, res) => {
        let data = await statusService.add(req.body);
        res.json(data)
    }
    
    delete = async (req, res) => {
        let data = await statusService.delete(req.params.id);
        res.json(data)
    }
    updateContent = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const content = req.body.content;

        let data = await statusService.updateContent(userId, content);
        res.json(data);
    }
    updateVisibility = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const visibility = req.body.visibility;
        let data = await statusService.updateVisibility(userId, visibility);
        res.json(data);
    }

    findAllByIdUser = async (req, res) => {
        const userId = req.params.id;
        let data = await statusService.findByIdUser(userId)
        res.json(data);
    }

    findStatusByIdUser = async (req, res) => {
        let data = await statusService.findStatusByIdUser(req.params.senderId, req.params.receiverId)
        res.json(data);
    }

    findByIdAndStatus = async (req, res) => {
        let data = await statusService.findByIdAndStatus(req.params.userId)
        res.json(data);
    }

    findByIdAndStatusPublic = async (req, res) => {
        let data = await statusService.findByIdAndStatusPublic(req.params.userId)
        res.json(data);
    }
    findByContent = async (req, res) => {
        let data = await statusService.findByContent(req.params.userId,req.query.content)
        res.json(data);
    }

    findStatusById = async (req, res) => {
        let data = await statusService.findStatusById(req.params.id)
        res.json(data);
    }
}

export default new StatusController()