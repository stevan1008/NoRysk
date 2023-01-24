/*
* @Author: Andres Fabian Jimenez Torres
*/

export class Encriptor {
    private originalDelUsuario: string;
    private encriptado: string;
    private encriptadoFinal: string;
    private senuelo: number;

    constructor() {
        this.originalDelUsuario = '';
        this.encriptado = '';
        this.encriptadoFinal = '';
        this.senuelo = -1;
    }

    private setValoresIniciales() {
        this.encriptado = '';
        this.encriptadoFinal = '';
        this.senuelo = Math.floor(Math.random() * (26 - 1)) + 1;
    }

    public setTexto(texto: string): void {
        this.originalDelUsuario = texto;
    }

    encriptar(): string {
        this.setValoresIniciales();

        if (this.senuelo % 2 === 0) {
            this.encriptado = this.encriptado.concat(this.encriptado, String.fromCharCode(65 + (this.senuelo * 2 + 6)));
        } else {
            this.encriptado = this.encriptado.concat(this.encriptado, String.fromCharCode(57 - this.senuelo));
        }

        for (let i = 0; i < this.senuelo; i++) {
            const caracterAleatorio = Math.floor(Math.random() * (125 - 48)) + 48;
            this.encriptado = this.encriptado + String.fromCharCode(caracterAleatorio);
        }

        const num1 = Math.floor(Math.random() * (15 - 5) + 5);
        const num2 = Math.floor(Math.random() * (15 - 5) + 5);

        if (num1 % 2 === 0) {
            this.encriptado = this.encriptado + String.fromCharCode(65 + num1);
        } else {
           this.encriptado = this.encriptado + String.fromCharCode(65 - num1);
        }

        if (num2 % 2 === 0) {
            this.encriptado = this.encriptado + String.fromCharCode(65 + num2);
        } else {
            this.encriptado = this.encriptado + String.fromCharCode(65 - num2);
        }

        const tamanoCadena = this.originalDelUsuario.length;

        for (let i = 0; i < tamanoCadena; i++) {
            const asciiActual = this.originalDelUsuario[i].charCodeAt(0);

            if (i % 2 === 0) {
                this.encriptado = this.encriptado + String.fromCharCode(asciiActual - num1);
            } else {
               this.encriptado = this.encriptado + String.fromCharCode(asciiActual - num2);
            }
        }

        for (let i = 0; i < this.encriptado.length; i++) {
            this.encriptadoFinal = this.encriptadoFinal + String.fromCharCode(this.encriptado[i].charCodeAt(0) + i);
        }

        // Comprobacion
        const length = this.encriptadoFinal.length.toString();
        let lengthFinal = '';

        for (let i = 0; i < length.length; i++) {
            lengthFinal += String.fromCharCode(length[i].charCodeAt(0) + 25);
        }

        this.encriptadoFinal = lengthFinal + 'y@2' + this.encriptadoFinal;

        return this.encriptadoFinal;
    }
}
