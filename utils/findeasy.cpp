#include <bits/stdc++.h>
using namespace std;

int main() {
    ifstream inFile("sorted-exps.txt");
    ofstream outFile("easiest.txt");
    
    if (!inFile || !outFile) {
        cerr << "Error opening files!" << endl;
        return 1;
    }
    string line;
    map<string,string> expressions_map;

    while (getline(inFile, line)) {
        if (!line.empty()) {
            string nums ="";
            for(char c : line) {
                if (c<='9' && c>='0') {
                    nums += c;
                }
            }
            if(expressions_map.find(nums) == expressions_map.end()) {
                expressions_map[nums] = line;
                outFile << line << "\n";
            }
        }
    }
    inFile.close();
    outFile.close();

    cout<<"File processed successfully. Check 'easiest.txt' for results."<<endl;
    return 0;
}
