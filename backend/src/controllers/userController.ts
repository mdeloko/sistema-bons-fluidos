import { CreateUserDTO, SafeUserDTO } from "../models/dtos/userDtos.js";
import { UserService } from "../models/services/userService.js";
import { EHttpStatusCode as StatusCode } from "../@types/httpStatusCode.js"
import { Request,Response } from "express";

export class UserController{
    constructor(private userService:UserService) {}

    public async createUser(req:Request, res:Response){
        const user = req.body;
        console.log(user)
        if(!user.name || !user.ra || !user.email || !user.password || user.isAdmin == undefined){
            res.status(StatusCode.BAD_REQUEST).json({error:"Faltando propriedades!"}).send();
            return
        }
        try{
            const safeUser = await this.userService.create(user);
            if(safeUser){
                res.status(StatusCode.CREATED).json(safeUser);
                return
            }
            res.status(StatusCode.CONFLICT).json({error:"Já existe usuário associado ao RA/Email."});
            return
        }catch(err){
            console.log(err)
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({error:err})
        }
    }
    public async updateUser(req:Request, res:Response){
        const data = req.body;
        if(!data.field || !data.ra || !data.email || !data.valueToUpdateTo){
            res.status(StatusCode.BAD_REQUEST).json({
                status:StatusCode.BAD_REQUEST,
                error:"Faltando parâmetros!"
            });
        }
        const {field, ra, email, valueToUpdateTo} = data
        switch(field){
            case "email":
                this.userService.
                break;
            case "name":

                break;
            case "ra":

                break;
            case "password":

                break;
            default:
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json()
        }

    }

}