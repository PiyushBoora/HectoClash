#include<bits/stdc++.h>
using namespace std;

// Returns precedence of operators
int precedence(char op) {
    if (op == '+' || op == '-')
        return 1;
    if (op == '*' || op == '/' || op == 'm')  // 'm' represents the *10+ operator
        return 2;
    if (op == '^')
        return 3;
    return 0;
}

// Evaluates a given mathematical expression
double evaluate(string s) {
    // Replace *10+ with special character 'm' for easier parsing
    size_t pos = 0;
    while ((pos = s.find("*10+", pos)) != string::npos) {
        s.replace(pos, 4, "m");
    }
    
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
                else if (op == 'm') values.push(val1 * 10 + val2); // *10+ operator
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
                else if (op == 'm') values.push(val1 * 10 + val2); // *10+ operator
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
        else if (op == 'm') values.push(val1 * 10 + val2); // *10+ operator
    }
    
    return values.top();
}

bool isequalto100(string s) {
    double result = evaluate(s);
    return abs(result - 100.0) < 1e-5;
}

int main() {
    string s;
    cout << "Enter an expression: ";
    getline(cin, s);
    if (isequalto100(s)) {
        cout << "The expression evaluates to 100." << endl;
    } else {
        cout << "The expression does not evaluate to 100." << endl;
    }
    return 0;
}
