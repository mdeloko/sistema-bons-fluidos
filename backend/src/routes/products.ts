import { Router } from "express";
import { EHttpStatusCode as httpResponses } from "../@types/httpStatusCode.js";
export const router = Router({mergeParams:true});

router.get("/",(req,res)=>{
    //TODO: Implementar busca por todos os produtos no banco
})

router.get("/id/:id", (req, res) => {
  const { id } = req.params;
  //TODO: Implementar busca por ID de usuário no banco. ProductsController.
  res.status(httpResponses.OK).json({ message: "Product Found!", id });
});

router.get("/name/:name", (req, res) => {
  const { name } = req.params;
  //TODO: Implementar busca por nome de usuário no banco. ProductsController.
  res.status(httpResponses.OK).json({ message: "Product Found!", name });
});

router.get("/origin/:origin", (req, res) => {
  const { origin } = req.params;
  //TODO: Implementar busca por origem de usuário no banco. ProductsController.
  res.status(httpResponses.OK).json({ message: "Product Found!", origin });
});
