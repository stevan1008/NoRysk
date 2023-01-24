import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pantalla-espera',
  templateUrl: './pantallaEspera.component.html',
  styleUrls: ['./pantallaEspera.component.css']
})
export class PantallaEsperaComponent implements OnInit {

  @Input() public identificador: string;

  constructor() {
    this.identificador = '';
  }

  ngOnInit() {
  }

  activarModoEspera() {
    document.getElementById('esperaModal' + this.identificador)?.classList.add('show');
    document.getElementById('esperaModal' + this.identificador)?.classList.remove('hide');
  }

  desactivarModoEspera() {
    document.getElementById('esperaModal' + this.identificador)?.classList.add('hide');
    document.getElementById('esperaModal' + this.identificador)?.classList.remove('show');
  }
}
