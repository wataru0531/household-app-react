

// Firestoreから取得したオブジェクトを元に、収入、支出、残高を返す関数

import { Transaction, Balance } from "../types";

export function financeCalculations(_transactions: Transaction[]): Balance {
  // console.log(_transactions); 
  // [{id: '6rblq1UPv564Xd32jdlB', category: '給与', amount: '2000', date: '2024-12-09', type: 'income', …}, {…}, {…}]
  // {id: 'PMHbPIAcpE6i4bxFezTp', category: '副収入', date: '2024-12-03', amount: 500, type: 'income', …}
  // {id: 'QqGa4FgWCSli3RNLCWnD', date: '2024-12-07', type: 'expense', content: 'トマト', amount: 300, …}

  // 合計値が返す
  // accu ... 累積値。accumulation
  return _transactions.reduce((accu, curr) => {
    // console.log(accu); // {income: 0, expense: 0, balance: 0}
    // 初期値。これにcurrである、_transactionオブジェクトのincome、expenseをそれぞれ分けてプラスしていく
    // console.log(curr);

    if(curr.type === "income"){
      accu.income += curr.amount;
    } else {
      accu.expense += curr.amount;
    }

    accu.balance = accu.income - accu.expense;

    // console.log(accu); 
    return accu;
    // → 最初のループが終われば次にループのaccuに設定され、ループが終了したらその最後のaccuが返される

  }, { income: 0, expense: 0, balance: 0 }); // 初期値。accuに入る

}

