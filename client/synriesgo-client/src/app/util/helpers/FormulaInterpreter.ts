export class FormulaInterpreter {
  private formula: string;
  private variables: any;

  constructor() {
    this.variables = [];
    this.formula = '';
  }

  public setVariable(description: string, value: number) {
    if (description.trim() !== '') {
      const index = this.variables.findIndex((x: any) => { return x.description == description.trim()});

      if (index == -1) {
        this.variables.push({'description': description, 'value': value});
      } else {
        this.variables[index].value = value;
      }
    }

    if (this.formula !== '') {
      this.replaceVariables();
    }
  }

  public setFormula(formula: string) {
    this.formula = formula.replace(/\s/g, '');

    if (this.variables.length > 0) {
      this.replaceVariables();
    }

    return this.validateFormulaSyntax();
  }

  public getProcessedFormula() {
    return this.formula;
  }

  public getResult() {
    let result = this.processExpression(0, this.formula.length - 1);

    return result;
  }

  private validateFormulaSyntax() {
    let mistakes = '';

    let firstParenthesis = true;
    let wrongFirstParenthesis = false;
    let parethesisCount = 0;
    let wrongOperators = false;

    // Faced parenthesis
    const facedParenthesis: boolean = this.formula.match(/[(][)]|[)][()]/gm) !== null;

    // Wrong parenthesis
    const wrongParenthesis = this.formula.match(/\([\+\-\*\/\\^\√]\)|\([0-9]*[\+\-\*\/\\^\√]\)|\([\+\-\*\/\\^\√][0-9]*\)/gm) !== null;

    // Wrong operations
    let wrongOperations = this.formula.match(/([0-9]|[0-9]*\.[0-9]*)+\(|\)([0-9]|[0-9]*\.[0-9]*)+/gm) !== null;
    wrongOperations = wrongOperations || this.formula.match(/\+{2,}|\-{2,}|\*{2,}|\/{2,}|\^{2,}|\√{2,}/gm) !== null;
    wrongOperations = wrongOperations || this.formula.match(/[\+\-\*\/\\^\√]+[\+\-\*\/\\^\√]+/gm) !== null;
    wrongOperations = wrongOperations || this.formula.match(/^[\+\-\*\/\\^\√]+[\+\-\*\/\\^\√]*([0-9]|[0-9]*\.[0-9]*)+/gm) !== null;
    wrongOperations = wrongOperations || this.formula.match(/^([0-9]|[0-9]*\.[0-9]*)*[\+\-\*\/\\^\√]$/gm) !== null;

    for (let i = 0; i < this.formula.length; i++) {
      // Incomplete parethesis
      if (this.formula[i] === '(') {
        parethesisCount++;
        firstParenthesis = false;
      } else if (this.formula[i] === ')') {
        if (firstParenthesis) {
          wrongFirstParenthesis = true;
          firstParenthesis = false;
        }

        parethesisCount--;
      }

      // Wrong operators
      if (isNaN(+this.formula[i]) && this.formula[i] !== '(' && this.formula[i] !== ')' && this.formula[i] !== '.' && this.formula[i] !== ',') {
        const op = this.formula[i];

        if (op !== '+' && op !== '-' && op !== '*' && op !== '/' && op !== '^' && op !== '√') {
          wrongOperators = true;
        }
      }
    }

    // Parenthesis mistakes
    if (parethesisCount !== 0 || wrongFirstParenthesis) {
      if (mistakes != '') { mistakes += '. ';}
      mistakes += 'No todos los paréntesis han sido cerrados.';
    }

    if (facedParenthesis) {
      if (mistakes != '') { mistakes += ' '; }
      mistakes += 'Hay paréntesis enfrentados "()".';
    }

    if (wrongParenthesis) {
      if (mistakes != '') { mistakes += ' '; }
      mistakes += 'Hay paréntesis no formados correctamente. p.e. "(+2)" "(2+)" "(+)".';
    }

    // Operators
    if (wrongOperators) {
      if (mistakes != '') { mistakes += ' '; }
      mistakes += 'Hay operadores no válidos. Solo se permite + - * / ^ √.';
    }

    // Operations
    if (wrongOperations) {
      if (mistakes != '') { mistakes += ' '; }
      mistakes += "Hay operaciones no válidas. p.e. '25(' ')25' '++' '**' '+/' '+2'  '2+'.";
    }

    return mistakes
  }

  private replaceVariables() {
    for (const vrb of this.variables) {
      this.formula = this.formula.replaceAll(vrb.description, vrb.value);
    }

    console.log(this.formula);
  }

  // Recursive function to solve teh formula
  private processExpression(start: number, end: number, deep: number = 1) {
    let inParenthesis = 0;
    let startPar = -1;
    let endPar = -1;

    let number = 0;
    let decimal = 0;
    let lastOperation = '+';
    let result: number | null = null;

    // Convert into expressions
    for (let i = start; i <= end; i++) {
      // Simple operations
      if (this.formula[i] !== '(' && this.formula[i] !== ')' && inParenthesis == 0) {
        // Create the decimal part of the number
        if (isNaN(+this.formula[i]) && (this.formula[i] == '.' || this.formula[i] == ',')) {
          decimal = 10;
          continue;
        }

        // Create the int part of the number
        if (!isNaN(+this.formula[i])) {
          if (decimal == 0) {
            number *= 10;
            number += (+this.formula[i]);
          } else {
            number += (+this.formula[i] / decimal);
            decimal *= 10;
          }
        }

        if (isNaN(+this.formula[i]) && (this.formula[i] != '.' && this.formula[i] != ',')) { // Make the operation

          if (result == null) { // First expression
            result = number;

            lastOperation = this.formula[i];
            number = 0;
            decimal = 0;
          } else { // Demas expresiones
            result = this.solveOperation(result!, number, lastOperation);

            lastOperation = this.formula[i];
            number = 0;
            decimal = 0;
          }
        }
      }

      // Grouped operations
      if (this.formula[i] === '(') {
        inParenthesis++;

        if (inParenthesis === 1) {
          startPar = i + 1;
        }
      }

      if (this.formula[i] === ')') {
        inParenthesis--;

        if (inParenthesis == 0) {
          endPar = i - 1;

          number = this.processExpression(startPar, endPar, deep + 1)!;

          startPar = -1;
          endPar = -1;
        }
      }
    }

    // Solve last opertaion
    result = this.solveOperation(result!, number, lastOperation);

    return result;
  }

  private solveOperation(expression1: number, expression2: number, operation: string) {
    let result = 0;

    if (operation == '+') {
      result = (+expression1) + (+expression2);
    } else if (operation == '-') {
      result = (+expression1) - (+expression2);
    } else if (operation == '*') {
      result = (+expression1) * (+expression2);
    } else if (operation == '/') {
      result = (+expression1) / (+expression2);

      if (!isFinite(result)) {
        result = 0;
      }
    } else if (operation == '^') {
      result = Math.pow(+expression1, +expression2);
    } else if (operation == '√') {
      if (+expression1 == 2) {
        result = Math.sqrt(+expression2);
      } else if (+expression1 == 3) {
        result = Math.cbrt(+expression2);
      }
    }

    return result;
  }
}