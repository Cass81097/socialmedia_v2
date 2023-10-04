import {Request, Response} from "express";
import userService from "../service/userService";


export class UserController {
    register = async (req: Request, res: Response) => {
        const user = await userService.register(req.body);
        res.status(201).json({ message: user, userId: user.id });
    }

    login = async (req: Request, res: Response) => {
        let resultCheck = await userService.checkUser(req.body);
        res.status(200).json(resultCheck);
    }

    update = async (req: Request, res: Response) => {
        let data = await userService.update(req.params.id, req.body);
        console.log(req.params.id, req.body);
        res.json(data);
    }

    findAll = async (req,res)=>{
        let list = await userService.findAll()
        res.json(list)
    }

    findByUserName = async (req,res)=>{
        let result = await userService.findByUserName(req.params.username)
        res.json(result)
    }

    findByEmail = async (req,res)=>{
        let result = await userService.findByEmail(req.params.email)
        res.json(result)
    }

    findAllUserName = async (req,res)=>{
        let result = await userService.findAllUserName()
        res.json(result)
    }

    findUserByName = async (req,res)=>{
        let result = await userService.findByName(req.params.name)
        res.json(result)
    }

    findUserById = async (req,res)=>{
        let result = await userService.findUserById(req.params.id)
        res.json(result)
    }

    updatePassword = async (req: Request, res: Response) => {
        let data = await userService.updatePassword
        (req.params.id, req.body.oldPassword,req.body.newPassword);
        console.log(req.params.id, req.body);
        res.status(200).json(data);
        
    }

    updateAvatar = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const avatar = req.body.avatar;
        let data = await userService.updateAvatar(userId, avatar);
        res.json(data);
    }

    updateCover = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const cover = req.body.cover;
        let data = await userService.updateCover(userId, cover);
        res.json(data);
    }

}
export default new UserController()