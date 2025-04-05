#include <bits/stdc++.h>
using namespace std;

int main()
{
    ifstream inFile("easiest.txt");
    ofstream outFile("json.txt");

    if (!inFile || !outFile)
    {
        cerr << "Error opening files!" << endl;
        return 1;
    }
    string line;
    outFile<<"const sequences = [\n";
    while (getline(inFile, line))
    {
        if (!line.empty())
        {
            outFile << "    [";
            int i=0;
            for (auto c : line)
            {
                if (c <= '9' && c >= '0')
                {
                    i++;
                    outFile << "\"";
                    outFile << c;
                    if(i<6)
                    outFile << "\", ";
                    else
                    outFile << "\"";
                }
            }
            outFile << "],\n";
        }
    }
    outFile<<"];";
    inFile.close();
    outFile.close();
    return 0;
}
