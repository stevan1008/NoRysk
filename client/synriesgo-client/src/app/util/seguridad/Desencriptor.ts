import { environment } from "src/environments/environment";

/*
* @Author: Andres Fabian Jimenez Torres
*/
export class Desencriptor {
    private originalDelUsuario: string;
    private encripOriginal: string;
    private desencriptado: string;
    private hack: boolean;

    constructor() {
        this.originalDelUsuario = '';
        this.encripOriginal = '';
        this.desencriptado = '';

        this.hack = false;
    }

    private setValoresIniciales() {
        this.encripOriginal = '';
        this.desencriptado = '';
    }

    setTexto(texto: string): void {
        this.originalDelUsuario = texto;
    }

    desencriptar(): any {
        this.setValoresIniciales();

        if (this.originalDelUsuario !== null) {
            this.verificarIntegridadEncriptado();

            if (!this.hack) {
                for (let i = 0; i < this.originalDelUsuario.length; i++) {
                    this.encripOriginal = this.encripOriginal + String.fromCharCode(this.originalDelUsuario[i].charCodeAt(0) - i);
                }

                this.originalDelUsuario = this.encripOriginal;

                this.originalDelUsuario = this.encripOriginal;

                const longitudCadena = this.originalDelUsuario.length;

                let indice = 0;

                const senuelo = this.originalDelUsuario[indice].charCodeAt(0);

                const longitudSenuelo = (senuelo >= 65 ? (senuelo - 71) / 2 : (57 - senuelo));

                indice += longitudSenuelo + 1;

                const num1 = this. originalDelUsuario[indice].charCodeAt(0) >= 65
                            ? this.originalDelUsuario[indice].charCodeAt(0) - 65
                            : 65 - this.originalDelUsuario[indice].charCodeAt(0);

                indice++;

                const num2 = this.originalDelUsuario[indice].charCodeAt(0) >= 65
                            ? this.originalDelUsuario[indice].charCodeAt(0) - 65
                            : 65 - this.originalDelUsuario[indice].charCodeAt(0);

                indice++;

                let internalIndex = 0;

                for (let i = indice; i < longitudCadena; i++) {
                    const asciiActual = this.originalDelUsuario[i].charCodeAt(0);

                    if (internalIndex % 2 === 0) {
                        this.desencriptado += String.fromCharCode(asciiActual + num1);
                    } else {
                        this.desencriptado += String.fromCharCode(asciiActual + num2);
                    }

                    internalIndex++;
                }

                return this.desencriptado;
            }
        }

        return null;
    }

    private verificarIntegridadEncriptado() {
        const posComprobacion = this.originalDelUsuario.indexOf('y@2');
        let encriptado = '';

        if (posComprobacion !== -1) {
            let comprobacion = '';

            //  Sacar la comporbacion
            for (let i = 0; i < posComprobacion; i++) {
                comprobacion += String.fromCharCode(this.originalDelUsuario[i].charCodeAt(0) - 25);
            }

            // Sacar el encriptado
            for (let i = posComprobacion + 3; i < this.originalDelUsuario.length; i++) {
                encriptado += this.originalDelUsuario[i];
            }

            const comprobacionFinal: number = +comprobacion;

            if (!isNaN(comprobacionFinal) && comprobacionFinal === encriptado.length) {
                this.originalDelUsuario = encriptado;
            } else {
                this.hack = true;
                this.cerrarSesion();
            }
        } else {
            this.hack = true;
            this.cerrarSesion();
        }
    }

    private cerrarSesion() {
        try {
            let idIntToken = sessionStorage.getItem('idIntToken')!;

            this.setTexto(idIntToken!.toString());
            window.clearInterval(this.desencriptar());

            sessionStorage.removeItem('token');
            sessionStorage.removeItem('id_usuario');
            sessionStorage.removeItem('nombre_usuario');
            sessionStorage.removeItem('rol_usuario');
            sessionStorage.removeItem('correo_usuario');
            sessionStorage.removeItem('idIntToken');
        } catch {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('id_usuario');
            sessionStorage.removeItem('nombre_usuario');
            sessionStorage.removeItem('rol_usuario');
            sessionStorage.removeItem('correo_usuario');
            sessionStorage.removeItem('idIntToken');
        }

        window.location.href = environment.client;
    }
}
