import express from "express";
import {EHttpStatusCode as httpResponses} from "./@types/httpStatusCode.js";
import {router as productsRouter} from "./routes/products.js";
import { router as usersRouter } from "./routes/users.js";

const PORT = process.env.PORT || 3000;
const server = express();
server.use("/products",productsRouter);
server.use("/users",usersRouter);
server.use(express.json());

server.get("/",(req, res) => {
    const body = {
        message:"Greetings!",
        status:httpResponses.OK
    }
    res.status(httpResponses.OK).json(body);
});



server.listen(PORT, (error) =>
    error ? console.error(error) : console.log("Servidor rodando na porta", PORT)
);



