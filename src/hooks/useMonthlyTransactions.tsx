

import react, { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { formatMonth } from "../utils/formatting";
import { Transaction } from "../types";


 // 月間(1ヶ月)の取引データを取得する関数
// transactions または currentMonth の状態が変わるたびに、再評価される
// → 変更があれば再レンダリングされて、最新の monthlyTransactions が反映される
//   変更されたstateがあれば、依存しているコンポーネント(この場合は AppもHomeも)が再レンダリングされる
const useMonthlyTransactions = (): Transaction[] => {
  const { transactions, currentMonth } = useAppContext();
  console.log(transactions)

  const monthlyTransactions = useMemo(() => {
    return transactions.filter((transaction) => (
      // console.log(transaction); // {id: '6rblq1UPv564Xd32jdlB', category: '給与', type: 'income', date: '2024-12-09', amount: '2000', …}
      // console.log(transaction.date.startsWith(formatMonth(currentMonth)))
      
      // 今月の月日に合致する月のデータのみstateに保持
      // formatMonth → 日付のフォーマットを変更。例: 2024-12
      transaction.date.startsWith(formatMonth(currentMonth))
    ))

    // transactions, currentMonthが更新された時のみ実行
  }, [ transactions, currentMonth ]);
  
  return monthlyTransactions;
}

export default useMonthlyTransactions;