import { CreateUserDTO, GeneralUserUpdateDTO, SafeUserDTO } from "../models/dtos/userDtos.js";
import { UserService } from "../models/services/userService.js";
import { EHttpStatusCode as StatusCode } from "../@types/httpStatusCode.js"
import { Request,Response } from "express";

export class UserController{
    constructor(private userService:UserService) {}

    public async createUser(req:Request, res:Response){
        const user = req.body;
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
        const params = req.params as {email?:string, ra?:string}
        const data = req.body as GeneralUserUpdateDTO;
        if(!data.field || !data.valueToUpdateTo){
            res.status(StatusCode.BAD_REQUEST).json({
                status:StatusCode.BAD_REQUEST,
                error:"Faltando parâmetros!"
            });
        }
        const {field, valueToUpdateTo} = data
        const valueToSearch = (params.email? params.email : params.ra) as string;
        let user;
        if(field=="email"){
            user = await this.userService.updateEmail({newEmail:valueToUpdateTo, ra:valueToSearch});
            if (user){
                res.status(StatusCode.OK).json({...user,message:"Atualizado com sucesso!",status:StatusCode.OK});
                return
            }
        }
        if(field=="name"){
            user = await this.userService.updateName({name:valueToUpdateTo, ra:valueToSearch});
            if (user){
                res.status(StatusCode.OK).json({...user,message:"Atualizado com sucesso!",status:StatusCode.OK});
                return
            }
        }
        if(field=="ra"){
            user = await this.userService.updateRa({
                newRa: valueToUpdateTo,
                email:valueToSearch,
            });
            console.log(valueToUpdateTo,valueToSearch,user)
            if (user) {
                res.status(StatusCode.OK).json({
                    ...user,
                    message: "Atualizado com sucesso!",
                    status: StatusCode.OK,
                });
                return;
            }
        }
        if(field=="password"){
            user = await this.userService.updatePassword({
                password: valueToUpdateTo,
                ra: valueToSearch,
            });
            if (user) {
                res.status(StatusCode.OK).json({
                    ...user,
                    message: "Atualizado com sucesso!",
                    status: StatusCode.OK,
                });
                return;
            }
        }
        res.status(StatusCode.CONFLICT).json({message:"Erro desconhecido."});
    }

    public async readUser(req:Request, res:Response){
        const user = req.body

    }
}