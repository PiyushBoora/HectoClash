#include <bits/stdc++.h>
using namespace std;

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

int main() {
    ifstream in("output.txt");
    ofstream out("sorted-exps.txt");
    if (!in) {
        cerr << "Failed to open output.txt\n";
        return 1;
    }

    vector<pair<int, string>> expressions;
    string line;
    while (getline(in, line)) {
        if (line.empty() || line.find("Generated") != string::npos) continue;
        int score = computeDifficulty(line);
        expressions.emplace_back(score, line);
    }

    sort(expressions.begin(), expressions.end());

    for (auto p : expressions) {
        out << p.second << '\n';
    }

    cout << "Sorted expressions saved to sorted-exps.txt\n";
    return 0;
}
