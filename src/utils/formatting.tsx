
// 変換に関する処理

import { format } from "date-fns";

// 
export function formatMonth(_date: Date): string{ // 引数への型定義
  // console.log(_date); // Wed Dec 11 2024 16:07:38 GMT+0900 (日本標準時)
  // console.log(format(_date, "yyyy-MM")); // 2024-12
  return format(_date, "yyyy-MM");
}

// 日本円に変換する処理
// toLocaleString
// → Number型（数値）や Date 型（日時）に対して使えるメソッドで、
// ローカライズされた形式で数値や日付を文字列として返すために使用。
// 特に、数値を地域ごとの通貨表示や数値フォーマットに変換する際に便利
export function formatCurrency(_amount: number): string{
  // console.log(_amount)
  return _amount.toLocaleString("js-JP");
}