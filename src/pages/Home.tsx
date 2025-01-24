
// Home
import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { format } from "date-fns";

import MonthlySummary from "../components/layout/MonthlySummary";
import Calendar from "../components/layout/Calendar";
import TransactionMenu from "../components/layout/TransactionMenu";
import TransactionForm from "../components/layout/TransactionForm";
import { Transaction } from "../types";
import { Schema } from "../validations/schema";
import { theme } from "../theme/theme";
import { DateClickArg } from "@fullcalendar/interaction";

interface HomeProps {
  monthlyTransactions: Transaction[] // オブジェクトの配列
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>> // useStateの更新関数の型
  onSaveTransition: (_transaction: Schema) => Promise<void>
  onDeleteTransaction: (_transactionsId: string | readonly string[]) => Promise<void>
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

  // レスポンシブ
  // sm: 600px md: 900px, lg: 1200px
  // ここでは、1200pxを下回ればtrueを返す
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  // console.log(isMobile);

  const today = format(new Date(), "yyyy-MM-dd"); // 今日の日付
  const [ currentDay, setCurrentDay ] = useState(today);
  // console.log(currentDay); // Fri Dec 13 2024 16:26:20 GMT+0900 (日本標準時) ... ローカライズされた文字列表現
  
  const [ isEntryDrawerOpen, setIsEntryDrawerOpen ] = useState(false); // ドロワーの開閉ステート

  // その日における1つの取引のデータ。右サイドのカードのステート
  const [ selectedTransaction, setSelectedTransaction ] = useState<Transaction | null>(null);

  // モバイル時のドロワーの開閉に関するステート
  const [ isMobileDrawerOpen, setIsMobileDrawerOpen ] = useState(false);

  // Dialogの開閉状態を管理するステートを表示
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);

  // 選択されて日の取引データを取得(配列)
  const dailyTransactions = monthlyTransactions.filter(transaction => {
    // console.log(transaction); // {id: '25ZjJ0OxeuZM4G2jlfL0', type: 'expense', content: '更新料', date: '2024-12-07', amount: 7000, …}
    return transaction.date === currentDay;
  });
  // console.log(dailyTransactions);

  // フォームを閉じる処理
  // → クリックした取引をクリア　+ Dialogの開閉処理
  const onCloseForm = () => {  
    setSelectedTransaction(null);

    // Dialogをfalseにする
    if(isMobile){
      // モバイル時のDialog
      setIsDialogOpen(prev => !prev);
    } else {
      // PC時のDialog
      setIsEntryDrawerOpen(prev => !prev);
    }
  }

  // フォームの開閉処理の更新関数
  const onHandleAddTransactionForm = () => {
    if(isMobile){
      // モバイル時はDialogを開ける
      setIsDialogOpen(true);
    } else {
      // PC時の処理
      if(selectedTransaction){
        // フォームの内容が選択されている時は開閉処理は行わない(カードがクリックされている時)
        // → 一度フォームを空にしてから開閉処理を行う
        setSelectedTransaction(null);
      } else {
        // フォームの内容が選択されていない時に開閉処理を行う(カードがクリックされていない時)
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }
  }

  // 取引項目(カード)が選択された時の処理 → フォームに反映する
  const onSelectTransaction = (_transaction: Transaction) => {
    // console.log(_transaction); // {id: 'EjCj7N2Nt3Hjqhn8L1zM', content: 'KD', amount: 50000, date: '2024-12-25', category: '給与', …}

    // console.log(selectedTransaction);
    setSelectedTransaction(_transaction);
    // →　ここで選択した取引データをフォームに渡して、フォームの各項目に反映していく
    
    if(isMobile){
      setIsDialogOpen(true);
    } else {
      setIsEntryDrawerOpen(true); // ドロワーを開く
    }
  
  }

  // カレンダーをクリックした時
  const handleDateClick = (_dateInfo: DateClickArg) => {
    // console.log(_dateInfo); // {date: Sun Dec 01 2024 00:00:00 GMT+0900 (日本標準時), dateStr: '2024-12-01', allDay: true, dayEl: td.fc-day.fc-day-sun.fc-day-past.fc-daygrid-day, jsEvent: MouseEvent, …}
    setCurrentDay(_dateInfo.dateStr);
    setIsMobileDrawerOpen(true); // ドロワーを開く
  }

  // ドロワーを閉じる処理
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
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
          handleDateClick={ handleDateClick }
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
          isMobile= { isMobile }
          isMobileDrawerOpen={ isMobileDrawerOpen }
          handleCloseMobileDrawer={ handleCloseMobileDrawer }
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
          isMobile={ isMobile }
          isDialogOpen={ isDialogOpen }
          setIsDialogOpen={ setIsDialogOpen }
        />
      </Box>
    </Box>
  )
}

export default Home;