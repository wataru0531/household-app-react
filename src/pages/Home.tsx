
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
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
  handleSaveTransition: (_transaction: Schema) => Promise<void>
}

const Home: React.FC<HomeProps> = ({ 
  monthlyTransactions, 
  setCurrentMonth,
  handleSaveTransition
}) => {
  // console.log(monthlyTransactions); // その月の取引履歴のみ

  // 今日の日付を取得
  const today = format(new Date(), "yyyy-MM-dd"); // 日付形式を変換
  const [ currentDay, setCurrentDay ] = useState(today);
  // console.log(currentDay); // Fri Dec 13 2024 16:26:20 GMT+0900 (日本標準時) ... ローカライズされた文字列表現
  const [ isEntryDrawerOpen, setIsEntryDrawerOpen ] = useState(false); // ドロワーの開閉ステート

  // その月で、取引のあった日のみのデータを取得
  const dailyTransactions = monthlyTransactions.filter(transaction => {
    // console.log(transaction);
    return transaction.date === currentDay;
  });
  // console.log(dailyTransactions);

  const onCloseForm = () => {  // ドロワーに渡すフォームに渡す開閉処理の更新関数
    setIsEntryDrawerOpen(!isEntryDrawerOpen)
  }

  // 右サイドバーに渡すフォームの開閉処理の更新関数
  const onHandleAddTransactionForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
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
        />

        {/* フォーム(ドロワー) */}
        <TransactionForm 
          isEntryDrawerOpen={ isEntryDrawerOpen }
          onCloseForm={ onCloseForm } 
          currentDay={ currentDay }
          handleSaveTransition={ handleSaveTransition }  
        />
      </Box>
    </Box>
  )
}

export default Home;