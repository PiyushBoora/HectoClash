#include <bits/stdc++.h>
using namespace std;

// Returns precedence of operators
int precedence(char op) {
    if (op == '+' || op == '-')
        return 1;
    if (op == '*' || op == '/' || op == 'm')  // 'm' represents the merge operator
        return 2;
    if (op == '^')
        return 3;
    return 0;
}

// Evaluates a given mathematical expression
double evaluate(string s) {
    stack<double> values;
    stack<char> ops;
    
    for (int i = 0; i < s.length(); i++) {
        if (s[i] == ' ')
            continue;
            
        if (isdigit(s[i])) {
            values.push(s[i] - '0');
        }
        else if (s[i] == '(') {
            ops.push(s[i]);
        }
        else if (s[i] == ')') {
            while (!ops.empty() && ops.top() != '(') {
                double val2 = values.top(); values.pop();
                double val1 = values.top(); values.pop();
                char op = ops.top(); ops.pop();
                
                if (op == '+') values.push(val1 + val2);
                else if (op == '-') values.push(val1 - val2);
                else if (op == '*') values.push(val1 * val2);
                else if (op == '/') {
                    if (val2 == 0) return INFINITY; // Division by zero
                    values.push(val1 / val2);
                }
                else if (op == '^') values.push(pow(val1, val2));
                else if (op == 'm') values.push(val1 * 10 + val2); // merge operator
            }
            
            if (!ops.empty()) ops.pop();
        }
        else {
            while (!ops.empty() && precedence(ops.top()) >= precedence(s[i])) {
                if (ops.top() == '(') break;
                
                double val2 = values.top(); values.pop();
                double val1 = values.top(); values.pop();
                char op = ops.top(); ops.pop();
                
                if (op == '+') values.push(val1 + val2);
                else if (op == '-') values.push(val1 - val2);
                else if (op == '*') values.push(val1 * val2);
                else if (op == '/') {
                    if (val2 == 0) return INFINITY; // Division by zero
                    values.push(val1 / val2);
                }
                else if (op == '^') values.push(pow(val1, val2));
                else if (op == 'm') values.push(val1 * 10 + val2); // merge operator
            }
            
            ops.push(s[i]);
        }
    }
    
    while (!ops.empty()) {
        double val2 = values.top(); values.pop();
        double val1 = values.top(); values.pop();
        char op = ops.top(); ops.pop();
        
        if (op == '+') values.push(val1 + val2);
        else if (op == '-') values.push(val1 - val2);
        else if (op == '*') values.push(val1 * val2);
        else if (op == '/') {
            if (val2 == 0) return INFINITY; // Division by zero
            values.push(val1 / val2);
        }
        else if (op == '^') values.push(pow(val1, val2));
        else if (op == 'm') values.push(val1 * 10 + val2); // merge operator
    }
    
    return values.top();
}

// Generate expressions
void generateExpressions(vector<int>& digits, ofstream& out) {
    int n = digits.size();
    
    // Generate all possible ways to insert operators between digits
    int maxOps = n - 1;  // Maximum number of operators
    int maxCombinations = pow(6, maxOps);  // 6 operators: +, -, *, /, ^, m
    
    for (int i = 0; i < maxCombinations; i++) {
        string expr = "";
        expr += to_string(digits[0]);
        
        int temp = i;
        
        for (int j = 1; j < n; j++) {
            int op = temp % 6;
            temp /= 6;
            
            if (op == 0) expr += '+';
            else if (op == 1) expr += '-';
            else if (op == 2) expr += '*';
            else if (op == 3) expr += '/';
            else if (op == 4) expr += '^';
            else expr += "m";  // The merge operator
            
            expr += to_string(digits[j]);
        }
        
        // Try without parentheses first
        if (abs(evaluate(expr) - 100.0) < 1e-9) {
            out << expr << " = 100" << endl;
        }
        
        // Try with one pair of parentheses
        for (int j = 0; j < n-1; j++) {
            for (int k = j+1; k < n; k++) {
                // Find positions to insert parentheses
                string tempExpr = expr;
                int openPos = 0;
                int closePos = 0;
                
                // Count characters to find correct positions
                int charCount = 0;
                int digitCount = 0;
                
                for (int p = 0; p < tempExpr.length(); p++) {
                    if (isdigit(tempExpr[p])) {
                        digitCount++;
                        if (digitCount == j+1) openPos = charCount;
                        if (digitCount == k+1) closePos = charCount + 1;
                    }
                    charCount++;
                }
                
                // Insert parentheses
                tempExpr.insert(openPos, "(");
                tempExpr.insert(closePos + 1, ")");
                
                if (abs(evaluate(tempExpr) - 100.0) < 1e-9) {
                    out << tempExpr << " = 100" << endl;
                }
            }
        }
    }
}

int main() {
    cout << "Generating expressions resulting in 100 using 6 single digits..." << endl;
    ofstream out("output.txt");
    out << "Generated expressions resulting in 100:" << endl;
    
    vector<int> allDigits = {1, 2, 3, 4, 5, 6, 7, 8, 9};
    
    // Generate all combinations of 6 digits from 1-9
    vector<bool> v(9);
    fill(v.end() - 6, v.end(), true);
    
    do {
        vector<int> currentDigits;
        for (int i = 0; i < 9; i++) {
            if (v[i]) {
                currentDigits.push_back(allDigits[i]);
            }
        }
        
        // Generate all permutations of these 6 digits
        do {
            generateExpressions(currentDigits, out);
        } while (next_permutation(currentDigits.begin(), currentDigits.end()));
        
    } while (next_permutation(v.begin(), v.end()));
    
    out.close();
    cout << "Data generation complete. Check output.txt" << endl;
    return 0;
}
