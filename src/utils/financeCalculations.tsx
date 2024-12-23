
// 収入、支出、残高を計算する関数

import { Transaction, Balance } from "../types";


// Firestoreから取得したオブジェクトを元に、収入、支出を計算して、残高を返す関数
export function financeCalculations(_transactions: Transaction[]): Balance {
  // console.log(_transactions); 
  // [{id: '6rblq1UPv564Xd32jdlB', category: '給与', amount: '2000', date: '2024-12-09', type: 'income', …}, {…}, {…}]
  // {id: 'PMHbPIAcpE6i4bxFezTp', category: '副収入', date: '2024-12-03', amount: 500, type: 'income', …}
  // {id: 'QqGa4FgWCSli3RNLCWnD', date: '2024-12-07', type: 'expense', content: 'トマト', amount: 300, …}

  // 合計値が返す
  // accu ... 累積値。accumulation
  // curr ... 配列の要素が入ってくる
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

// 日付ごとの収入、支出、残高のオブジェクトを生成
export function calculateDailyBalances(_transactions: Transaction[]): Record<string, Balance>{
  // Record ...  TypeScript に組み込まれているユーティリティ型の名前
  //             その場で即座に型を決めることができる
  // string → 日付(2024-12-02)の型
  // Balance →  { income: 300, expense: 200, balance: 100 } の型

  // console.log(_transactions);
  // Record<string, Balance> → 初期値の{}に対しての型定義。初期値の{}に何が入るのかtypescriptが理解できていない
  return _transactions.reduce<Record<string, Balance>>((accu, curr) => { 
    // (2) [{id: '6rblq1UPv564Xd32jdlB', type: 'income', date: '2024-12-09', content: '銀行振込', amount: '2000', …}, {…}]
    // console.log(accu); // {}、{2024-12-09: {…}}、{2024-12-09: {…}}, {2024-12-09: {…}, 2024-12-03: {…}}
    // console.log(curr); // _transactionが1つづつ渡ってくる

    const day = curr.date;
    // if(accu[day]) { return accu }; // すでに格納ずみのオブジェクトがあれば早期リターンでスキップ

    if(!accu[day]){ // オブジェクトにそのdateがない場合のみ追加
      // console.log(day)
      accu[day] = { income: 0, expense: 0, balance: 0 }
      // console.log(accu); // { 2024-12-09: {income: 2000, expense: 7200, balance: 0}}
      // console.log(accu[day]); // {income: 0, expense: 0, balance: 0}
    }

    if(curr.type === "income"){
      accu[day].income += curr.amount;
    } else {
      // console.log(curr.amount)
      accu[day].expense += curr.amount;
    }
  
    // accu[day].balance = accu[day].income - accu[day].expense;

    // console.log(accu); // { 2024-12-09: {income: 2000, expense: 7200, balance: 0}, 2024-12-03: {…}, 2024-12-07: {…} }
    return accu;
  }, {}); // この初期値のオブジェクトにincome, expense, balanceを追加
}