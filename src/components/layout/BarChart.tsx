
// 棒グラフ

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import { Transaction } from '../../types';
import { calculateDailyBalances } from '../../utils/financeCalculations';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
// → Reactのコンポーネント形式でChart.jsを簡単に使えるようにしたもの。
//   Chart.jsの設定やデータ構造をそのまま使用可能

// グラフ作成に使うモジュールを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  monthlyTransactions: Transaction[]
  isLoading: boolean
}

const BarChart: React.FC<BarChartProps> = ({ monthlyTransactions, isLoading }) => {
  // console.log(monthlyTransactions); 
  // → (2) [{id: 'Bx9mXMFLNws9Y5FGf3qV', amount: 1000, type: 'expense', date: '2025-01-01', content: '鯖', …}, {…}]

  // useTheme → デフォルトのthemeに加えて、自作で定義したテーマも反映された完全なテーマオブジェクトを取得可能
  const theme = useTheme();
  // console.log(theme); // {breakpoints: {…}, direction: 'ltr', components: {…}, palette: {…}, spacing: ƒ, …}

  const options = {
    maintainAspectRatio: false, // アスペクト比は保たない(任意に設定)
    responsive: true,
    plugins: {
      legend: {
        // position: 'top' as const, // ラベルの位置
        // →　リテラル型にキャストするために使用される。
        //    具体的には、文字列 "top" のような値を型として、そのまま「文字列リテラル型」を指定することができる
        //    リテラル型にすることで値の変更を防ぐことができる、型推論がより厳格になる、変更不可能で安定したコードになる
      },
      title: {
        display: true,
        text: '日別収支', // グラフタイトル
      },
    },
  };

  // その日における取引データ。日付: {income: 300, expense: 1000, balance: 0}
  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  // console.log(dailyBalances); // { 2025-01-01: {income: 300, expense: 1000, balance: 0}}

  // その日における取引データの日付の配列を生成。labelに入れるため
  const dataLabels = Object.keys(dailyBalances); // keyの配列を作る。列挙可能なプロパティのみ取得
  // console.log(dataLabels); // (2) ['2025-01-01', '2025-01-06]

  const incomeData = dataLabels.map(dataLabel => {
    return dailyBalances[dataLabel].income;
  });
  // console.log(incomeData); // (2) [300, 15]

  const expenseData = dataLabels.map(dayLabel => {
    return dailyBalances[dayLabel].expense;
  });
  // console.log(expenseData); // (2) [1000, 900]

  // ブラフの横軸
  const data: ChartData<"bar"> = {
    labels: dataLabels,
    datasets: [
      {
        label: '収入',
        data: incomeData,
        backgroundColor: theme.palette.incomeColor.light,
      },
      {
        label: '支出',
        data: expenseData,
        backgroundColor: theme.palette.expenseColor.light,
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {
        isLoading? (
          <CircularProgress /> // ローディング
        ) : 
        monthlyTransactions.length > 0 ? (
          <Bar options={ options } data={ data } />
        ) : (
          <Typography>データがありません</Typography> // pタグ
        )
      }
    </Box>
    
  )
}

export default BarChart;