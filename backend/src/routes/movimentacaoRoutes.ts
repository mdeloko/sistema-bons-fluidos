import { Router } from "express";
import { MovimentacaoController } from "../controllers/movimentacaoController.js";
import { verifyJWT } from "../utils/validations.js";

export const router = Router({ mergeParams: true });

const movimentacaoController = new MovimentacaoController();

router.post("/",verifyJWT,movimentacaoController.createMovimentacao.bind(movimentacaoController));
router.get("/",verifyJWT,movimentacaoController.listMovimentacoes.bind(movimentacaoController));
router.get("/:id_vendas",verifyJWT,movimentacaoController.getMovimentacaoById.bind(movimentacaoController));
router.put("/:id_vendas",verifyJWT,movimentacaoController.updateMovimentacao.bind(movimentacaoController));
router.delete("/:id_vendas",verifyJWT,movimentacaoController.deleteMovimentacao.bind(movimentacaoController));