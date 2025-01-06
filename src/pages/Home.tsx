
// Home
import { useState } from "react";
import { Box } from "@mui/material";

import MonthlySummary from "../components/layout/MonthlySummary";
import Calendar from "../components/layout/Calendar";
import TransactionMenu from "../components/layout/TransactionMenu";
import TransactionForm from "../components/layout/TransactionForm";
import { Transaction } from "../types";
import { format } from "date-fns";
import { Schema } from "../validations/schema";

interface HomeProps {
  monthlyTransactions: Transaction[] // オブジェクトの配列
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>> // useStateの更新関数の型
  onSaveTransition: (_transaction: Schema) => Promise<void>
  onDeleteTransaction: (_transactionsId: string) => Promise<void>
  onUpdateTransaction: (_transaction: Schema, _transactionsId: string) => Promise<void>
}

const Home: React.FC<HomeProps> = ({ 
  monthlyTransactions, 
  setCurrentMonth,
  onSaveTransition,
  onDeleteTransaction,
  onUpdateTransaction,
}) => {
  // console.log(monthlyTransactions); // その月の取引履歴のみ

  const today = format(new Date(), "yyyy-MM-dd"); // 今日の日付
  const [ currentDay, setCurrentDay ] = useState(today);
  // console.log(currentDay); // Fri Dec 13 2024 16:26:20 GMT+0900 (日本標準時) ... ローカライズされた文字列表現
  const [ isEntryDrawerOpen, setIsEntryDrawerOpen ] = useState(false); // ドロワーの開閉ステート

  // その日における1つの取引のデータ。右サイドのカードのステート
  const [ selectedTransaction, setSelectedTransaction ] = useState<Transaction | null>(null);

  // 選択されて日の取引データを取得(配列)
  const dailyTransactions = monthlyTransactions.filter(transaction => {
    // console.log(transaction); // {id: '25ZjJ0OxeuZM4G2jlfL0', type: 'expense', content: '更新料', date: '2024-12-07', amount: 7000, …}
    return transaction.date === currentDay;
  });
  // console.log(dailyTransactions);

  // フォームを閉じる処理
  const onCloseForm = () => {  
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
    setSelectedTransaction(null);
  }

  // 右サイドバーに渡すフォームの開閉処理の更新関数
  const onHandleAddTransactionForm = () => {
    if(selectedTransaction){
      // フォームの内容が選択されている時は開閉処理は行わない(カードがクリックされている時)
      // → 一度フォームを空にしてから開閉処理を行う
      setSelectedTransaction(null);
    } else {
      // フォームの内容が選択されていない時に開閉処理を行う(カードがクリックされていない時)
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  }

  // 取引項目(カード)が選択された時の処理 → フォームに反映する
  const onSelectTransaction = (_transaction: Transaction) => {
    // console.log(_transaction); // {id: 'EjCj7N2Nt3Hjqhn8L1zM', content: 'KD', amount: 50000, date: '2024-12-25', category: '給与', …}
    setIsEntryDrawerOpen(true); // ドロワーを開く

    // console.log(selectedTransaction);
    setSelectedTransaction(_transaction);
    // →　ここで選択した取引データをフォームに渡して、フォームの各項目に反映していく
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={ monthlyTransactions } />
        <Calendar 
          monthlyTransactions={ monthlyTransactions } 
          setCurrentMonth={ setCurrentMonth } 
          currentDay={ currentDay }
          setCurrentDay={ setCurrentDay }
          today={ today }
        />
      </Box>

      {/* 右コンテンツ */}
      <Box>
        {/* 収入、支出、残高、内訳 */}
        <TransactionMenu 
          currentDay={ currentDay } 
          dailyTransactions={ dailyTransactions }  
          onHandleAddTransactionForm={ onHandleAddTransactionForm }
          onSelectTransaction={ onSelectTransaction }
        />

        {/* フォーム(ドロワー) */}
        <TransactionForm 
          isEntryDrawerOpen={ isEntryDrawerOpen }
          onCloseForm={ onCloseForm } 
          currentDay={ currentDay }
          onSaveTransition={ onSaveTransition }  
          onDeleteTransaction={ onDeleteTransaction }
          selectedTransaction={ selectedTransaction }
          setSelectedTransaction={ setSelectedTransaction }
          onUpdateTransaction={ onUpdateTransaction } 
        />
      </Box>
    </Box>
  )
}

export default Home;