#include <iostream>
using namespace std;
int main()
{
    // 20115 Anshul Kumar
    int n;
    cout << "Enter the length of an array:" << endl;
    cin >> n;
    int a[n], e[n], o[n], index1 = 0, index2 = 0;
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        if (a[i] % 2 == 0)
        {
            e[index1] = a[i];
            index1++;
        }
        else
        {
            o[index2] = a[i];
            index2++;
        }
    }
    cout << "even array:" << endl;
    for (int i = 0; i < index1; i++)
    {

        cout << e[i] << " ";
    }
    cout << " \n"
         << "odd array:" << endl;
    for (int i = 0; i < index2; i++)
    {
        cout << o[i] << " ";
    }

    return 0;
}
