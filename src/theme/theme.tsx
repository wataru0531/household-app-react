
// アプリ全体に適用テーマに関するオブジェクト。フォントなど
// App.tsxで適用

import { createTheme, PaletteColor, PaletteColorOptions } from "@mui/material";
import { blue, green, red } from "@mui/material/colors";

// muiの型を拡張
// MUIのデフォルトのパレットには用意されていない独自のカラーキー(incomeColor)をPalette型に追加し、
// createThemeで利用できるようにする

// declare module → TypeScriptの構文で、既存のモジュールの型情報を拡張するために使用
//                  ここではMUIが提供する、@mui/material/styles モジュールを拡張。styleフォルダにあるファイル全体に適用
//                  キーとプロパティを挿入すれば拡張できる
declare module "@mui/material/styles" {
  interface Palette {
    incomeColor: PaletteColor;
    expenseColor: PaletteColor;
    balanceColor: PaletteColor;
  }

  // createTheme()で、paletteプロパティを指定する際に使われるオプションの型
  interface PaletteOptions {
    incomeColor: PaletteColorOptions;
    expenseColor: PaletteColorOptions;
    balanceColor: PaletteColorOptions;
  }
}

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
  },
  palette: {
    // カスタムカラーを生成
    incomeColor: { // 収入
      main: blue[500],
      light: blue[100],
      dark: blue[700],
    },
    expenseColor: {
      main: red[500],
      light: red[100],
      dark: red[700],
    },
    balanceColor: {
      main: green[500],
      light: green[100],
      dark: green[700],
    }
  }
})