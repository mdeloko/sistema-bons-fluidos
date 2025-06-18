import express from "express";
import {EHttpStatusCode as httpResponses} from "./@types/httpStatusCode.js";
import {router as productsRouter} from "./routes/productsRoutes.js";
import { router as usersRouter } from "./routes/usersRoutes.js";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const server = express();

server.use(
	cors({
		origin: "http://localhost:5173/", // Permita especificamente a origem do seu frontend
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Quais métodos HTTP são permitidos
		credentials: true, // Se sua aplicação usar cookies/sessões com credenciais
		optionsSuccessStatus: 204, // Status para respostas de pré-voo OPTIONS
	})
);
server.use(express.json());
server.use("/products",productsRouter);
server.use("/users",usersRouter);

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
