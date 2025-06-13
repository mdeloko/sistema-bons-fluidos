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

