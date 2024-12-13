
// Calendar (Home)
// カレンダー

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";

import "../../calendar.css"; // 
import { calculateDailyBalances } from "../../utils/financeCalculations";
import { Balance, CalenderContent, Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatting";


interface CalendarProps {
  monthlyTransactions: Transaction[]
  setCurrentMonth:  React.Dispatch<React.SetStateAction<Date>>
}

const Calendar: React.FC<CalendarProps> = ({ monthlyTransactions, setCurrentMonth }) => {
  // console.log(monthlyTransactions); // (4) [{id: '6rblq1UPv564Xd32jdlB', amount: 2000, category: '給与', type: 'income', content: '銀行振込', …}, {…}, {…}, {…}]

  // 日付ごとの収入、支出、残高のオブジェクトを生成
  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  // console.log(dailyBalances); 
  // {2024-12-09: 2024-12-03: { income: 500, expense: 0, balance: 500}, 2024-12-03: {…}, 2024-12-07: {…} }

  // FullCalenderで使えるオブジェクトの配列の形式に柊生
  const createCalenderEvents = (_dailyBalances: Record<string, Balance>): CalenderContent[] => {
    // Object.keys → キーを配列で取得。(3) ['2024-12-09', '2024-12-03', '2024-12-07']
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

  // fullcalenderで使えるように、、日付ごとのオブジェクトの配列にする
  const calenderEvents = createCalenderEvents(dailyBalances);
  // console.log(calenderEvents); // [(3) [{start: '2024-12-09', income: '2,000', expense: '0', balance: '2,000'}, {…}, {…}]]

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

  // 月を変更するボタンをクリックした際に発火
  const handleDateSet = (_eventInfo: DatesSetArg) => {
    // console.log(_eventInfo); // 月に関するデータを持つ
    setCurrentMonth(_eventInfo.view.currentStart);
  }

  return (
    <FullCalendar
      locale={ jaLocale } // 日本語
      plugins={[dayGridPlugin]} // 日付がgrid上で区切られた月のカレンダーを表示
      initialView="dayGridMonth" // 
      events={ calenderEvents } // 予定 配列のオブジェクトの形式でないとならない
      eventContent={ renderEventContent } // eventsの内容を拡張
      datesSet={ handleDateSet } // 月を変更するボタンをクリックしたら発火
    />
  )
}

export default Calendar;