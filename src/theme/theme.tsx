
// テーマに関するオブジェクト。フォントなど



import { createTheme } from "@mui/material";


export const theme = createTheme({
  typography: {
    // フォントスタック
    // sans-serif → フォールバックフォント
    //              すべての指定フォントが見つからない場合、ブラウザのシステム設定に基づいたデフォルトのサンセリフ体が適用される
    //              (例：Windowsでは「Segoe UI」、Macでは「Helvetica」など)
    fontFamily: 'Noto Sans JP, Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,

  }
})