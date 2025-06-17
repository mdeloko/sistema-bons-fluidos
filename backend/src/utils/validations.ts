import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import {EHttpStatusCode as StatusCode} from "../@types/httpStatusCode.js";

export const SECRET = process.env.JWT_SECRET || "segredo!";
/**
	 * Valida uma senha.
	 * @param pw String de Senha a ser testada
	 * @returns true caso a senha seja validada, false caso contrário.
	 */
export function validatePassword(pw: string): boolean {
    return(
        /[0-9]/.test(pw) &&
        /[A-Z]/.test(pw) &&
        /[a-z]/.test(pw) &&
        /[!@#$%&*_]/.test(pw) &&
        pw.length >= 8
    )
}
export function validateEmail(email:string):boolean{
    const emailRegex = new RegExp(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	);
    return emailRegex.test(email);

}

export function verifyJWT(req:Request,res:Response,next:Function){
    const token = req.headers['authorization'];
    if(!token){
        res.status(StatusCode.BAD_REQUEST).end();
        return; 
    }
    try{
        const decoded = jwt.verify(token,SECRET);
        //@ts-ignore
        req.userId = decoded.userId; 
        next();
    }catch(err){
        if(err instanceof jwt.JsonWebTokenError && err.name === "TokenExpiredError"){
            res.status(StatusCode.UNAUTHORIZED).json({message:"Token expirado, faça login novamente!",status:StatusCode.UNAUTHORIZED});
            return;
        }
        res.status(StatusCode.UNAUTHORIZED).json({message:"Token inválido.",status:StatusCode.BAD_REQUEST});
        return; 
    }
}

