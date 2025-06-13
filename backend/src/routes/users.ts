import { Router } from "express";
import {EHttpStatusCode as httpStatus} from "../@types/httpStatusCode.js"
import { UserRepository } from "../models/repositories/userRepository.js";
import { UserService } from "../models/services/userService.js";
import { UserController } from "../controllers/userController.js";

export const router = Router({mergeParams:true});

const userRepo = new UserRepository()
const userService = new UserService(userRepo);
const userController = new UserController(userService);

router.get("/",(req,res) => {
    res.status(httpStatus.BAD_REQUEST).json({
        status:httpStatus.BAD_REQUEST,
        message:"Utilize o endpoint GET adequado, sendo /users/ar ou /users/email."});
});

router.get("/email/:email",(req,res)=>{
    //TODO: Implementar busca no banco por e-mail. UserController.
    res.status(httpStatus.OK).json({
        status:httpStatus.OK,
        message:"Usuário encontrado"

    });
});

router.get("/ar/:ar", (req, res) => {
    //TODO: Implementar busca no banco por Registro Acadêmico. UserController.
    res.status(httpStatus.OK).json({
        status: httpStatus.OK,
        message: "Usuário encontrado",

    });
});

router.post("/",userController.createUser.bind(userController));

router.put("/",userController.updateUser.bind(userController));

router.delete("/",(req,res) => {
    const { valueToSearch } = req.body;
    //TODO: Implementar lógica para encontrar qual é o tipo de dado a buscar(ra/e-mail), verificar se usuário que requisitou é administrador e efetivar alterações no banco
});

