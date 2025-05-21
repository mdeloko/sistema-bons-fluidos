import { Router } from "express";
import {EHttpStatusCode as httpStatus} from "../@types/httpStatusCode.js"

export const router = Router({mergeParams:true});

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

router.post("/",(req,res)=>{
    const {ar,name,password,email,isAdmin} = req.body;
    //TODO: Implementar inserção no banco. UserController.
});

router.put("/",(req,res)=>{
    const { valueToSearch, valueToUpdateTo } = req.body;
    //TODO: Implementar lógica de encontrar o dado de busca(Aqui), buscar no banco por este dado e atualizar o usuário(UserController).

});

router.delete("/",(req,res) => {
    const { valueToSearch } = req.body;
    //TODO: Implementar lógica para encontrar qual é o tipo de dado a buscar(ra/e-mail), verificar se usuário que requisitou é administrador e efetivar alterações no banco
});

