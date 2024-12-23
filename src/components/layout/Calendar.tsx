
// カレンダー

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import "../../calendar.css"; // 
import { calculateDailyBalances } from "../../utils/financeCalculations";
import { Balance, CalenderContent, Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatting";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";


interface CalendarProps {
  monthlyTransactions: Transaction[]
  setCurrentMonth:  React.Dispatch<React.SetStateAction<Date>>
  currentDay: string
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>
  today: string,
}

const Calendar: React.FC<CalendarProps> = ({ 
  monthlyTransactions, 
  setCurrentMonth,
  currentDay,
  setCurrentDay,
  today,
}) => {
  // console.log(monthlyTransactions); // (4) [{id: '6rblq1UPv564Xd32jdlB', amount: 2000, category: '給与', type: 'income', content: '銀行振込', …}, {…}, {…}, {…}]

  const theme = useTheme(); // themeオブジェクトを使えるようにする

  // 日付ごとの収入、支出、残高のオブジェクトを生成
  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  // console.log(dailyBalances); 
  // { 2024-12-09: {income: 2000, expense: 7200, balance: 0}, 2024-12-03: {…}, 2024-12-07: {…}}

  // FullCalenderで使えるオブジェクトの配列の形式に修正
  const createCalenderEvents = (_dailyBalances: Record<string, Balance>): CalenderContent[] => {
    // Object.keys → キーを配列で取得。(3) ['2024-12-09', '2024-12-03', '2024-12-07']
    // console.log(Object.keys(_dailyBalances)); // (3) ['2024-12-09', '2024-12-03', '2024-12-07']
    return Object.keys(_dailyBalances).map(date => {
      // console.log(date);
      const { income, expense, balance } = dailyBalances[date];
      // console.log(formatCurrency(income), expense, balance);

      return {
        start: date,
        income: formatCurrency(income), // 文字列型に
        expense: formatCurrency(expense),
        balance: formatCurrency(balance)
      }
    }); 
  }
  // console.log(createCalenderEvents(dailyBalances));
  // → (3) [{start: '2024-12-09', income: '2,000', expense: '7,200', balance: '0'}, {…}, {…}]

  // fullcalenderで使えるように、、日付ごとのオブジェクトの配列にする
  const calenderEvents = createCalenderEvents(dailyBalances);
  // console.log(calenderEvents); // [(3) [{start: '2024-12-09', income: '2,000', expense: '0', balance: '2,000'}, {…}, {…}]]

  // 背景色を変更するイベント → calenderEventsと統合していく
  // → 配列の最後に背景色用のイベントを格納する
  const backgroundEvent = {
    start: currentDay,
    // displayを指定することで、カレンダー上のイベントを 通常のイベント として表示するのか、背景イベント として表示するのかを区別できる
    display: "background", // 背景イベント として登録
    backgroundColor: theme.palette.incomeColor.light,
  }
  // console.log([...calenderEvents, backgroundEvent]);


  // カスタムプロップスの作成
  // events配列のオブジェクトの中では、titleとstartしか設定されていないので、
  // 他のプロパティを設定できるようにする
  const renderEventContent = (eventInfo: EventContentArg) => {
    // console.log(eventInfo); // {event: EventImpl, view: ViewImpl, timeText: '', textColor: '', backgroundColor: '', …}
    return (
      <div>
        <div className="money" id="event-income">
          { eventInfo.event.extendedProps.income }
        </div>
        <div className="money" id="event-expense">
          { eventInfo.event.extendedProps.expense }
        </div>
        <div className="money" id="event-balance">
          { eventInfo.event.extendedProps.balance }
        </div>
      </div>
    )
  }

  // 月を変更するボタンをクリックした際に発火(今日ボタン、矢印ボタン)
  const handleDateSet = (_eventInfo: DatesSetArg) => {
    // console.log(_eventInfo); // 月に関するデータを持つ
    // console.log(_eventInfo.view.currentStart); // 今月の初めの日
    const currentMonth = _eventInfo.view.currentStart;
    // console.log(currentMonth)
    setCurrentMonth(currentMonth);
    
    const todayDate = new Date(); // 今月

    // 表示月が今月の場合の時のみ、今日の日付を取得する
    // → 今日ボタンを押した時のみ日付を更新する
    //   今日ボタンは今月とは別の月の時にのみ発火できる仕様なのでそれに合わせて実装する
    if(isSameMonth(todayDate, currentMonth)){ // 今日の日付が今月の内ならtrue
      setCurrentDay(today);
    }
  }

  const handleDateClick = (_dateInfo: DateClickArg) => {
    // console.log(_dateInfo); // {date: Sun Dec 01 2024 00:00:00 GMT+0900 (日本標準時), dateStr: '2024-12-01', allDay: true, dayEl: td.fc-day.fc-day-sun.fc-day-past.fc-daygrid-day, jsEvent: MouseEvent, …}
    setCurrentDay(_dateInfo.dateStr);
  }

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]} // 日付がgrid上で区切られた月のカレンダーを表示
      locale={ jaLocale } // 日本語
      initialView="dayGridMonth" // 
      events={ [...calenderEvents, backgroundEvent] } // 予定 配列のオブジェクトの形式でないとならない
      eventContent={ renderEventContent } // eventsの内容を拡張
      datesSet={ handleDateSet } // 月を変更するボタンをクリックしたら発火
      dateClick={ handleDateClick } // 項目をクリックした時に発火。interactionPluginが必須
    />
  )
}

export default Calendar;