import { Component, OnInit, Input } from '@angular/core';
import { animate } from "motion"
import { faComputer, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error-conexion',
  templateUrl: './errorConexion.component.html',
  styleUrls: ['./errorConexion.component.css']
})
export class ErrorConexionComponent implements OnInit {

  @Input() public identificador: string;

  public faComputer = faComputer;
  public faXmark = faXmark;

  constructor() {
    this.identificador = '';
  }

  ngOnInit() {
  }

  activarErrorConexion() {
    document.getElementById('errorConexion' + this.identificador)?.classList.add('show');
    document.getElementById('errorConexion' + this.identificador)?.classList.remove('hide');

    animate(
      '#computerBug',
      { rotate: [0, 45, 0, -45, 0, 45, 0, -45, 0] },
      {
        duration: 5
      }
    );
  }

  desactivarError() {
    document.getElementById('errorConexion' + this.identificador)?.classList.add('hide');
    document.getElementById('errorConexion' + this.identificador)?.classList.remove('show');
  }
}
