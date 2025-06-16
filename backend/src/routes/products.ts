import { Router } from "express";
import { ProductController } from "../controllers/productController.js";
import { ProductService } from "../models/services/productService.js";
import { ProductRepository } from "../models/repositories/productRepository.js";
import { IProductRepository } from "../models/repositories/IProductRepository.js";

export const router = Router({mergeParams: true});

// Instanciação das camadas de dependência
const productRepository: IProductRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Rotas de Produto
router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/id/:id", productController.getProductById);
router.get("/name/:name", productController.getProductByName);
router.get("/origin/:origin", productController.getProductsByOrigin);
router.put("/:id", productController.updateProduct); // Atualização por ID
router.delete("/:id", productController.deleteProduct); // Deleção por ID
