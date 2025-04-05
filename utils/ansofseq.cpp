#include <bits/stdc++.h>
using namespace std;

vector<string> results; // To store unique expressions

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
void generateExpressions(vector<int>& digits) {
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
            results.push_back(expr);
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
                    results.push_back(tempExpr);
                }
            }
        }
    }
}

// Remove unnecessary parentheses from an expression
string removeUnnecessaryParentheses(const string &expr) {
    string simplified = expr;
    
    for (size_t i = 0; i < simplified.length(); i++) {
        if (simplified[i] == '(') {
            size_t j = i;
            int balance = 1;
            while (j + 1 < simplified.length() && balance > 0) {
                j++;
                if (simplified[j] == '(') balance++;
                if (simplified[j] == ')') balance--;
            }

            if (balance == 0) {
                string testExpr = simplified;
                testExpr.erase(i, 1);   // Remove '('
                testExpr.erase(j - 1, 1); // Remove ')'

                if (evaluate(testExpr) == evaluate(expr)) {
                    simplified = testExpr; // Update expression if result is unchanged
                    i = -1; // Restart loop to check again
                }
            }
        }
    }

    return simplified;
}

// Compute difficulty of an expression based on various factors
int computeDifficulty(const string &expr) {
    int paren = 0, exp = 0, div = 0, sub = 0, merge = 0, earlyOps = 0;

    for (size_t i = 0; i < expr.size(); ++i) {
        char c = expr[i];
        if (c == '(' || c == ')') paren++;
        else if (c == '^') exp++;
        else if (c == '/') div++;
        else if (c == '-') sub++;
        else if (c == 'm') merge++;  // Count merge operators
    }

    // Count early operators (first 3 ops after digits)
    int opsSeen = 0;
    for (size_t i = 0; i < expr.size() && opsSeen < 3; ++i) {
        if (expr[i] == '+' || expr[i] == '-' || expr[i] == '*' || expr[i] == '/' || expr[i] == '^' || expr[i] == 'm') {
            earlyOps++;
            opsSeen++;
        }
    }

    // Calculate difficulty with merge operator weighted at 6
    return 8 * paren + 10 * exp + 5 * div + 3 * sub + 6 * merge + 2 * earlyOps;
}

int main(){
    vector<int> digits(6);
    cout<<"Enter 6 digits: ";
    for (int i = 0; i < 6; i++) {
        cin >> digits[i];
    }
    generateExpressions(digits);
    vector<pair<int, string>> expressions;
    set<string> uniqueResults;
    for(auto & expr : results) {
        string simplifiedExpr = removeUnnecessaryParentheses(expr);
        if (uniqueResults.find(simplifiedExpr) == uniqueResults.end()) {
            uniqueResults.insert(simplifiedExpr);
            int difficulty = computeDifficulty(simplifiedExpr);
            expressions.push_back({difficulty, simplifiedExpr});
        }
    }
    // Sort expressions by difficulty in ascending order (easiest first)
    sort(expressions.begin(), expressions.end(), [](const pair<int, string>& a, const pair<int, string>& b) {
        return a.first < b.first;
    });

    cout<<"Sorted Expressions by Difficulty (Easy to Hard):\n";
    for (const auto &p : expressions) {
        cout << p.second << "\n";
    }
    cout << "Total unique expressions: " << uniqueResults.size() << endl;
    return 0;
}