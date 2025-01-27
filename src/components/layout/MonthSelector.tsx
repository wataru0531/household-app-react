
// Reportページ

import { Box, Button } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { addMonths } from 'date-fns';
import { ja } from "date-fns/locale";
import { useAppContext } from '../../context/AppContext';

// interface MonthSelectorProps {
//   currentMonth: Date
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
// }


// const MonthSelector: React.FC<MonthSelectorProps> = ({ currentMonth, setCurrentMonth }) => {
const MonthSelector = () => {
  // console.log(currentMonth); // Wed Jan 01 2025 16:09:15 GMT+0900 (日本標準時)

  const { currentMonth, setCurrentMonth } = useAppContext();

  // 先月ボタン
  const handlePreviousMonth = () => {
    const previousMonth = addMonths(currentMonth, -1); // 現在の月から-1月する
    // console.log(previousMonth)
    setCurrentMonth(previousMonth);
  }

  // 次月ボタン
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
  }

  // 
  const handleDateChange = (_newDate: Date | null) => {
    // console.log(_newDate); // Sat Feb 01 2025 16:56:02 GMT+0900 (日本標準時)
    if(_newDate) setCurrentMonth(_newDate); // nullの可能性がるので
  }

  return (
    // LocalizationProvider 
    // → 日付ピッカーなどのローカライズ(言語や日付形式の設定)を管理するためのラッパーコンポーネント
    //   DatePicker(やその他の日付関連コンポーネント)が動作する際に必要なロケールや日付操作の基盤を提供する仕組みで、
    //   セットで使うのが基本的な設計になっている
    <LocalizationProvider 
      dateAdapter={ AdapterDateFns }
      // muiは時間系の機能を持っていないので、アダプタに他のライブラリのものを適用させる。date-fns以外にもmoment, luxonなどもある
      adapterLocale={ ja }
      // dateFormats={{ monthAndYear: "yyyy年 MM月" }} // dateFormatsにはmonthAndYearはない
    >
      {/* sx ... styling extension */}
      <Box sx={{ display: "flex", justifyContent:"center", alignItems: "center" }}>
        {/* 
          contained → colorで指定した色で背景を塗りつぶす
                      その場合、色は黒か白のどちらかになる
        */}
        <Button 
          color={"error"} 
          variant="contained"
          onClick={ handlePreviousMonth }
        >先月</Button>
        
        <DatePicker
          onChange={ handleDateChange }
          value={ currentMonth } // 初期値を付与。何も選択されていない場合は空(null)になる
          label={"年月を選択"}
          sx={{ mx: 2, background: "white" }} 
          views={[ "year", "month" ]} // 年、月のみ表示
          format="yyyy/MM" // 形式。西暦/月 の順
          slotProps={{ 
            toolbar: {
              toolbarFormat: "yyyy年MM月" // 3月2022 を 2022 3月 に入れかえる
            },
          }}
        />

        <Button 
          color={"primary"} 
          variant="contained"
          onClick={ handleNextMonth }
        >次月</Button>
      </Box>
    </LocalizationProvider>
  )
}

export default MonthSelector