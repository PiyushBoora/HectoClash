const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

// Convert the C++ solution generator to a Node.js module
class SolutionGenerator {
  static async generateSolutions(digits) {
    const solutions = [];
    
    function precedence(op) {
      if (op === '+' || op === '-') return 1;
      if (op === '*' || op === '/') return 2;
      return 0;
    }

    function evaluate(expr) {
      const values = [];
      const ops = [];
      
      for (let i = 0; i < expr.length; i++) {
        if (expr[i] === ' ') continue;
        
        if (!isNaN(expr[i])) {
          values.push(Number(expr[i]));
        } else if (expr[i] === '(') {
          ops.push(expr[i]);
        } else if (expr[i] === ')') {
          while (ops.length && ops[ops.length - 1] !== '(') {
            const val2 = values.pop();
            const val1 = values.pop();
            const op = ops.pop();
            
            if (op === '+') values.push(val1 + val2);
            else if (op === '-') values.push(val1 - val2);
            else if (op === '*') values.push(val1 * val2);
            else if (op === '/') {
              if (val2 === 0) return Infinity;
              values.push(val1 / val2);
            }
          }
          if (ops.length) ops.pop();
        } else {
          while (ops.length && precedence(ops[ops.length - 1]) >= precedence(expr[i])) {
            if (ops[ops.length - 1] === '(') break;
            
            const val2 = values.pop();
            const val1 = values.pop();
            const op = ops.pop();
            
            if (op === '+') values.push(val1 + val2);
            else if (op === '-') values.push(val1 - val2);
            else if (op === '*') values.push(val1 * val2);
            else if (op === '/') {
              if (val2 === 0) return Infinity;
              values.push(val1 / val2);
            }
          }
          ops.push(expr[i]);
        }
      }
      
      while (ops.length) {
        const val2 = values.pop();
        const val1 = values.pop();
        const op = ops.pop();
        
        if (op === '+') values.push(val1 + val2);
        else if (op === '-') values.push(val1 - val2);
        else if (op === '*') values.push(val1 * val2);
        else if (op === '/') {
          if (val2 === 0) return Infinity;
          values.push(val1 / val2);
        }
      }
      
      return values[0];
    }

    function generateExpressions(digits) {
      const n = digits.length;
      const maxOps = n - 1;
      const maxCombinations = Math.pow(4, maxOps);
      const uniqueResults = new Set();
      
      for (let i = 0; i < maxCombinations; i++) {
        let expr = digits[0].toString();
        let temp = i;
        
        for (let j = 1; j < n; j++) {
          const op = temp % 4;
          temp = Math.floor(temp / 4);
          
          if (op === 0) expr += '+';
          else if (op === 1) expr += '-';
          else if (op === 2) expr += '*';
          else expr += '/';
          
          expr += digits[j];
        }
        
        if (Math.abs(evaluate(expr) - 100) < 1e-9) {
          uniqueResults.add(expr);
        }
        
        // Try with parentheses
        for (let j = 0; j < n-1; j++) {
          for (let k = j+1; k < n; k++) {
            let openPos = j;
            let closePos = k;
            
            for (let p = 0; p <= j; p++) {
              openPos += (p < j) ? 1 : 0;
            }
            
            for (let p = 0; p <= k; p++) {
              closePos += (p < k) ? 1 : 0;
            }
            
            const newExpr = expr.slice(0, openPos) + '(' + 
                          expr.slice(openPos, closePos + 1) + ')' + 
                          expr.slice(closePos + 1);
            
            if (Math.abs(evaluate(newExpr) - 100) < 1e-9) {
              uniqueResults.add(newExpr);
            }
          }
        }
      }
      
      return Array.from(uniqueResults);
    }

    function computeDifficulty(expr) {
      let parenCount = 0, divisionCount = 0, subtractionCount = 0, earlyOpCount = 0;
      const n = expr.length;
      
      for (let i = 0; i < n; i++) {
        const c = expr[i];
        if (c === '(' || c === ')') {
          parenCount++;
        } else if (c === '/') {
          divisionCount++;
          if (i < n/2) earlyOpCount++;
        } else if (c === '-') {
          subtractionCount++;
          if (i < n/2) earlyOpCount++;
        } else if (c === '+' || c === '*') {
          if (i < n/2) earlyOpCount++;
        }
      }
      
      return (8 * parenCount) + (5 * divisionCount) + (3 * subtractionCount) + (2 * earlyOpCount);
    }

    const expressions = generateExpressions(digits)
      .map(expr => ({ 
        expression: expr, 
        difficulty: computeDifficulty(expr)
      }))
      .sort((a, b) => a.difficulty - b.difficulty)
      .slice(0, 5);

    return expressions;
  }
}

module.exports = SolutionGenerator;