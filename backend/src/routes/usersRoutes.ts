import { Router } from "express";
import {EHttpStatusCode as httpStatus} from "../@types/httpStatusCode.js"
import { UserRepository } from "../models/repositories/userRepository.js";
import { UserService } from "../models/services/userService.js";
import { UserController } from "../controllers/userController.js";
import { verifyJWT } from "../utils/validations.js";

export const router = Router({mergeParams:true});

const userRepo = new UserRepository()
const userService = new UserService(userRepo);
const userController = new UserController(userService);

router.post("/",userController.createUser.bind(userController));
router.post("/login",userController.login.bind(userController));
router.get("/",verifyJWT,userController.readAllUsers.bind(userController));
router.put("/email/:email",verifyJWT,userController.updateUser.bind(userController));
router.put("/ra/:ra", verifyJWT,userController.updateUser.bind(userController));
router.delete("/",verifyJWT,userController.deleteUser.bind(userController));
