import { Router } from "express";
import { ProductController } from "../controllers/productController.js";
import { ProductService } from "../models/services/productService.js";
import { ProductRepository } from "../models/repositories/productRepository.js";
import { IProductRepository } from "../models/repositories/IProductRepository.js";
import { verifyJWT } from "../utils/validations.js"; // <--- Importe o verifyJWT

export const router = Router({mergeParams: true});

// Instanciação das camadas de dependência
const productRepository: IProductRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Rotas de Produto
// Usamos arrow functions para garantir que o 'this' dentro dos métodos do controller
// Aplicando verifyJWT
router.post("/", verifyJWT, (req, res) => productController.createProduct(req, res));
router.get("/", verifyJWT, (req, res) => productController.getAllProducts(req, res));
router.get("/id/:id", verifyJWT, (req, res) => productController.getProductById(req, res));
router.get("/name/:name", verifyJWT, (req, res) => productController.getProductByName(req, res));
router.get("/origin/:origin", verifyJWT, (req, res) => productController.getProductsByOrigin(req, res));
router.put("/:id", verifyJWT, (req, res) => productController.updateProduct(req, res));
router.delete("/:id", verifyJWT, (req, res) => productController.deleteProduct(req, res));