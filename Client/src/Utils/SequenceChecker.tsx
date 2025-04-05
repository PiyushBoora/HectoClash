// function precedence(op: string): number {
//     if (op === '+' || op === '-') return 1;
//     if (op === '*' || op === '/') return 2;
//     return 0;
// }

// function applyOp(a: number, b: number, op: string): number {
//     if (op === '+') return a + b;
//     if (op === '-') return a - b;
//     if (op === '*') return a * b;
//     if (op === '/') return b !== 0 ? a / b : NaN;
//     return NaN;
// }

// function evaluate(expression: string): number {
//     const values: number[] = [];
//     const ops: string[] = [];

//     for (let i = 0; i < expression.length; i++) {
//         if (expression[i] === ' ') continue;

//         if (!isNaN(Number(expression[i]))) {
//             let val = 0;
//             while (i < expression.length && !isNaN(Number(expression[i])) && expression[i] !== ' ') {
//                 val = val * 10 + Number(expression[i]);
//                 i++;
//             }
//             values.push(val);
//             i--;
//         } else if (expression[i] === '(') {
//             ops.push(expression[i]);
//         } else if (expression[i] === ')') {
//             while (ops.length > 0 && ops[ops.length - 1] !== '(') {
//                 const b = values.pop()!;
//                 const a = values.pop()!;
//                 const op = ops.pop()!;
//                 values.push(applyOp(a, b, op));
//             }
//             ops.pop();
//         } else {
//             while (ops.length > 0 && precedence(ops[ops.length - 1]) >= precedence(expression[i])) {
//                 const b = values.pop()!;
//                 const a = values.pop()!;
//                 const op = ops.pop()!;
//                 values.push(applyOp(a, b, op));
//             }
//             ops.push(expression[i]);
//         }
//     }

//     while (ops.length > 0) {
//         const b = values.pop()!;
//         const a = values.pop()!;
//         const op = ops.pop()!;
//         values.push(applyOp(a, b, op));
//     }

//     return values[0];
// }

// export function isequalto100(expression: string): boolean {
//     const result = evaluate(expression);
//     console.log(result);
//     return Math.abs(result - 100.0) < 1e-9;
// }

function precedence(op: string): number {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/' || op === 'm') return 2; // 'm' is *10+
    if (op === '^') return 3;
    return 0;
  }
  
  function applyOp(a: number, b: number, op: string): number {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return b !== 0 ? a / b : NaN;
    if (op === '^') return Math.pow(a, b);
    if (op === 'm') return a * 10 + b;
    return NaN;
  }
  
  function evaluate(expression: string): number {
    const values: number[] = [];
    const ops: string[] = [];
  
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
  
      if (char === ' ') continue;
  
      if (!isNaN(Number(char))) {
        let val = 0;
        while (i < expression.length && !isNaN(Number(expression[i])) && expression[i] !== ' ') {
          val = val * 10 + Number(expression[i]);
          i++;
        }
        values.push(val);
        i--;
      } else if (char === '(') {
        ops.push(char);
      } else if (char === ')') {
        while (ops.length > 0 && ops[ops.length - 1] !== '(') {
          const b = values.pop()!;
          const a = values.pop()!;
          const op = ops.pop()!;
          values.push(applyOp(a, b, op));
        }
        ops.pop(); // remove '('
      } else {
        // Handle all operators including m and ^
        while (
          ops.length > 0 &&
          precedence(ops[ops.length - 1]) >= precedence(char)
        ) {
          const b = values.pop()!;
          const a = values.pop()!;
          const op = ops.pop()!;
          values.push(applyOp(a, b, op));
        }
        ops.push(char);
      }
    }
  
    while (ops.length > 0) {
      const b = values.pop()!;
      const a = values.pop()!;
      const op = ops.pop()!;
      values.push(applyOp(a, b, op));
    }
  
    return values[0];
  }
  
  export function isequalto100(expression: string): boolean {
    const result = evaluate(expression);
    console.log(result);
    return Math.abs(result - 100.0) < 1e-9;
  }
  