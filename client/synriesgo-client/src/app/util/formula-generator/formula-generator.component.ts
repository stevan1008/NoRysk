import { Component, OnInit, Output } from '@angular/core';
import { FormulaInterpreter } from '../helpers/FormulaInterpreter';

@Component({
  selector: 'app-formula-generator',
  templateUrl: './formula-generator.component.html',
  styleUrls: ['./formula-generator.component.css']
})
export class FormulaGeneratorComponent implements OnInit {

  @Output() variables: any;

  private formulaInterpreter: FormulaInterpreter;
  public operadores: any;

  public formula: any;
  public formulaTexto: string;
  public idElemento: number;
  public errores: string;
  public formulaProcesada: string;
  public resultadoPrueba: number | null;

  public variablesAgregadas: any;

  public numero: string;
  public numeroCorrecto: boolean;

  public variable: string;
  public variableCorrecta: boolean;

  public indiceSeleccionado: number;

  constructor() {
    this.formula = [];
    this.formulaTexto = '';
    this.idElemento = 0;
    this.errores = '';
    this.formulaProcesada = '';
    this.resultadoPrueba = null;

    this.numero = '';
    this.numeroCorrecto = false;
    this.variable = '';
    this.variableCorrecta = false;

    this.indiceSeleccionado = -1;

    this.variablesAgregadas = [];
    this.operadores = ['+', '-', '*', '/', '^', '√', '(', ')'];

    this.formulaInterpreter = new FormulaInterpreter();

    this.formulaInterpreter.setVariable('personas', 25.2);
    this.formulaInterpreter.setVariable('computadores', 41.1);
    this.formulaInterpreter.setVariable('jefes', 32.2);

    console.log(this.formulaInterpreter.setFormula('personas + computadores * jefes + ((2.5 + 2) + personas) + (3 * jefes)'));
    console.log(this.formulaInterpreter.getResult());
  }

  ngOnInit(): void {
  }

  public agregarElemento(elemento: string, esNumero: boolean = false) {
    if ((esNumero && this.numeroCorrecto) || !esNumero) {
      if (this.indiceSeleccionado === -1) {
        this.formula.push({'id': ++this.idElemento, 'elemento': elemento, 'variable': false, 'seleccionado': false});
      } else {
        this.formula[this.indiceSeleccionado].elemento = elemento;
        this.formula[this.indiceSeleccionado].seleccionado = false;
        this.indiceSeleccionado = -1;
      }

      this.convertirFormulaATexto();
      this.errores = this.formulaInterpreter.setFormula(this.formulaTexto);

      if (esNumero) {
        this.numero = '';
        this.numeroCorrecto = false;
      }

      this.resultadoPrueba = null;
    }
  }

  public agregarVariable(variable: string) {
    if (this.variableCorrecta) {
      const random = Math.round(Math.random() * (100 - 5) + 5);

      this.variablesAgregadas.push({variable: variable, valor: random});
      this.formulaInterpreter.setVariable(variable, random);

      if (this.indiceSeleccionado === -1) {
        this.formula.push({'id': ++this.idElemento, 'elemento': variable, 'variable': true, 'seleccionado': false});
      } else {
        this.formula[this.indiceSeleccionado].elemento = variable;
        this.formula[this.indiceSeleccionado].seleccionado = false;
        this.indiceSeleccionado = -1;
      }

      this.variable = '';
      this.variableCorrecta = false;

      this.convertirFormulaATexto();
      this.errores = this.formulaInterpreter.setFormula(this.formulaTexto);

      this.resultadoPrueba = null;
    }
  }

  public seleccionarElemento(id: number) {
    if (this.indiceSeleccionado !== -1) {
      this.formula[this.indiceSeleccionado].seleccionado = false;
    }

    this.indiceSeleccionado = this.formula.findIndex((x: any) => { return +x.id === id });
    this.formula[this.indiceSeleccionado].seleccionado = true;
  }

  public insertarElementoIzquierda(id: number) {
    const elementoNuevo = {'id': ++this.idElemento, 'elemento': '', 'seleccionado': true};

    if (+this.formula[0].id === id) {
      this.formula.unshift(elementoNuevo);
    } else {
      const index = this.formula.findIndex((x: any) => { return +x.id === id });

      this.formula.splice(index, 0, elementoNuevo);
    }

    this.indiceSeleccionado = this.formula.findIndex((x: any) => { return +x.id === this.idElemento });

    this.convertirFormulaATexto();
    this.errores = this.formulaInterpreter.setFormula(this.formulaTexto);

    this.resultadoPrueba = null;
  }

  public insertarElementoDerecha(id: number) {
    const elementoNuevo = {'id': ++this.idElemento, 'elemento': '', 'seleccionado': true};

    if (+this.formula[this.formula.length - 1].id === id) {
      this.formula.push(elementoNuevo);
    } else {
      const index = this.formula.findIndex((x: any) => { return +x.id === id });

      this.formula.splice(index + 1, 0, elementoNuevo);
    }

    this.indiceSeleccionado = this.formula.findIndex((x: any) => { return +x.id === this.idElemento });

    this.convertirFormulaATexto();
    this.errores = this.formulaInterpreter.setFormula(this.formulaTexto);

    this.resultadoPrueba = null;
  }

  public eliminarElemento(id: number, variable: string) {
    const nombreVariable = this.formula.filter((x: any) => { return +x.id === id })[0].elemento;
    this.formula = this.formula.filter((x: any) => { return +x.id !== id });

    if (variable) {
      this.variablesAgregadas = this.variablesAgregadas.filter((x: any) => { return x.variable !== nombreVariable});
    }

    this.convertirFormulaATexto();
    this.errores = this.formulaInterpreter.setFormula(this.formulaTexto);

    this.resultadoPrueba = null;
  }

  public validarNumero() {
    this.numero = this.numero.replace(',', '.');

    if (/(^[0-9]+$)|(^[0-9]+\.[0-9]+$)/gm.test(this.numero)) {
      this.numeroCorrecto = true;
    } else {
      this.numeroCorrecto = false;
    }
  }

  public validarVariable() {
    this.variable = this.variable.toLocaleUpperCase();

    if (/^[a-zA-z_]*$/gm.test(this.variable)) {
      this.variableCorrecta = true;
    } else {
      this.variableCorrecta = false;
    }
  }

  public probarIndicador() {
    this.formulaProcesada = this.formulaInterpreter.getProcessedFormula();
    this.resultadoPrueba = +this.formulaInterpreter.getResult().toFixed(3);
  }

  private convertirFormulaATexto() {
    this.formulaTexto = '';

    for (const frm of this.formula) {
      this.formulaTexto += ' ' + frm.elemento;
    }

    this.formulaTexto = this.formulaTexto.trim();
  }
}
