import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AccesoService } from 'src/app/services/acceso.service';
import { Desencriptor } from 'src/app/util/seguridad/Desencriptor';
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, map } from "rxjs/operators"; 

@Injectable()
export class UserAuthGuard implements CanActivate {

    private desencriptor: Desencriptor;

    constructor(private router: Router,
                private accesoService: AccesoService) {
        this.desencriptor = new Desencriptor();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        this.desencriptor.setTexto(sessionStorage.getItem('token')!);
        const llaveSesion = this.desencriptor.desencriptar();

        this.desencriptor.setTexto(sessionStorage.getItem('id_usuario')!);
        const idUsuario = this.desencriptor.desencriptar();

        if (llaveSesion === null || llaveSesion === '' || idUsuario === null || idUsuario === '') {
            this.router.navigate(['/app/acceso']);
            return false;
        }

        this.desencriptor.setTexto(sessionStorage.getItem('token')!);
        const jwt: any = JSON.parse(this.desencriptor.desencriptar());
        const access_token: any = jwt_decode(jwt.access_token);

        this.accesoService.actualizarJWTHeaders();

        this.desencriptor.setTexto(sessionStorage.getItem('rolUsuario')!)
        const rolUsuario: string = this.desencriptor.desencriptar();

        if (+rolUsuario === 1) {
            return this.accesoService.verificarTokenAdministrador(access_token.jti).pipe(
                map(() => {return true}),
                catchError(() => {
                    this.router.navigate(['/app/acceso']);
                    return of(false);
                })
            );
        }

        return this.accesoService.verificarTokenUsuario(access_token.jti).pipe(
            map(() => {return true}),
            catchError(() => {
                this.router.navigate(['/app/acceso']);
                return of(false);
            })
        );
    }
}