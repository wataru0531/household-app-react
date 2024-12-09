
import { format } from "date-fns";



export function formatMonth(_date: Date): string{ // 引数への型定義
  return format(_date, "yyyy-MM");
}