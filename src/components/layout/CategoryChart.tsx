
// 円グラフ
// 収入、支出のカテゴリー分けしたチャート

import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { ExpenseCategoryType, IncomeCategoryType, Transaction, TransactionType } from '../../types';
import { useTheme } from '@mui/material';

// ChartJS → ライブラリのコア部分で、チャートの作成や動作を支える本体のようなもの
//           チャートに必要なプラグインや要素を登録している
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  monthlyTransactions: Transaction[]
  isLoading: boolean
}

const CategoryChart: React.FC<CategoryChartProps> = ({ monthlyTransactions, isLoading }) => {
  // console.log(monthlyTransactions); // (4) [{id: 'Bx9mXMFLNws9Y5FGf3qV', content: '鯖', date: '2025-01-01', category: '食費', type: 'expense', …}, {…}, {…}, {…}]

  const theme = useTheme();

  const [ selectedType, setSelectedType ] = useState<TransactionType>("expense");

  const handleChange = (e: SelectChangeEvent<TransactionType>) => {
    // ここでは、eには、ChangeEvent 型のイベントオブジェクトで、そのイベントがどの要素から発生したかを型で指定している
    // e.target.valueは、"income"か"expense"のどちらかしか受け付けないと開発者は分かっているので、型アサーションで指定する
    setSelectedType(e.target.value as TransactionType);
  }

  // 1ヶ月分のデータの内、選択中の収支タイプに応じたデータ(配列)を取得
  const categoryTypes = monthlyTransactions.filter(transaction => (
    transaction.type === selectedType
  ));
  // console.log(categoryTypes); // (5) [{id: 'Bx9mXMFLNws9Y5FGf3qV', content: '鯖', category: '食費', type: 'expense', date: '2025-01-01', …}, {…}, {…}, {…}, {…}]

  // 1ヶ月分のカテゴリー別の合計金額を算出
  // Record型 → accに対しての型。
  //            特定のキーとその値の型を定義するためのユーティリティ型
  const categorySums = categoryTypes.reduce<Record<IncomeCategoryType | ExpenseCategoryType, number>>((acc, transaction) => {
    // IncomeCategoryType | ExpenseCategoryType → accのキーの型。キーには食費などのカテゴリーが渡ってくる
    // number → accの値の型
    // console.log(acc);
    // console.log(transaction);

    // 初めはtransaction.amountにはundefinedが渡ってくるので条件分岐
    if(!acc[transaction.category]){
      acc[transaction.category] = 0;
    }

    acc[transaction.category] += transaction.amount;

    return acc;
  }, {} as Record<IncomeCategoryType | ExpenseCategoryType, number>);
  // console.log(categorySums); // { 食費: 1900, 日用品: 620 }

  // カテゴリー名の配列
  // →　Object.keysを使うと必ずstringになるので、型アサーションを使う
  const categoryLabels = Object.keys(categorySums) as (IncomeCategoryType | ExpenseCategoryType)[];
  // console.log(categoryLabels); // (2) ['食費', '日用品']

  // 各カテゴリーの合計値
  const categoryValues = Object.values(categorySums);
  // console.log(categoryValues); // (2) [1900, 620]

  // チャートに渡すオプション
  const options = {
    maintainAspectRatio: false,
    responsive: true,
  }

  const incomeCategoryColor: Record<IncomeCategoryType, string>= {
    // ! →　非nullアサーション演算子
    //      ypeScriptに対して「この値はnullやundefinedではない」と明示的に伝える
    給与: theme.palette.incomeCategoryColor!.給与,
    副収入: theme.palette.incomeCategoryColor!.副収入,
    お小遣い: theme.palette.incomeCategoryColor!.お小遣い
  }

  const expenseCategoryColor: Record<ExpenseCategoryType, string> = {
    食費: theme.palette.expenseCategoryColor!.食費,
    日用品: theme.palette.expenseCategoryColor!.日用品,
    住居費: theme.palette.expenseCategoryColor!.住居費,
    交際費: theme.palette.expenseCategoryColor!.交際費,
    娯楽: theme.palette.expenseCategoryColor!.娯楽,
    交通費: theme.palette.expenseCategoryColor!.交通費,
  }

  // カテゴリー名に応じた色を取得する関数。
  const getCategoryColor = (_category: IncomeCategoryType | ExpenseCategoryType): string => {
    if(selectedType === "income"){
      // _categoryにはincomeCategoryかExpenseCategoryのどちらかが許容されるが、
      // incomeCategoryColorオブジェクトではincomeCategoryTypeのみしか許容していないために型エラーがでる
      return incomeCategoryColor[_category as IncomeCategoryType];
    } else {
      return expenseCategoryColor[_category as ExpenseCategoryType];
    }
  }


  const data: ChartData<"pie"> = {
    // ChartData<"pie"> → 特定のチャートタイプ（ここでは "pie"）に必要なデータ構造を型チェック
    //                    各チャートタイプ(bar, line, pieなど)にはそれぞれ特有のデータフォーマットや設定があある

    labels: categoryLabels, // カテゴリー名の配列
    datasets: [
      {
        data: categoryValues, // 各カテゴリーの合計値
        // 背景色 ... 配列で定義
        // backgroundColor: [
        //   'rgba(255, 99, 132, 0.2)',
        //   'rgba(54, 162, 235, 0.2)',
        //   'rgba(255, 206, 86, 0.2)',
        //   'rgba(75, 192, 192, 0.2)',
        //   'rgba(153, 102, 255, 0.2)',
        //   'rgba(255, 159, 64, 0.2)',
        // ],

        backgroundColor: categoryLabels.map((category) => {
          return getCategoryColor(category);
        }),
        borderColor: categoryLabels.map(category => (
          getCategoryColor(category)
        )),
        
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <>
      {/* 
        FormControl → フォームフィールド全体のコンテナ。 
                      ラベルと入力フィールドの関連付け、エラーメッセージの表示、,状態管理の補助などを行える
      */}
      <FormControl fullWidth>
        <InputLabel id="type-select-label">収支の種類</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={selectedType}
          label="収支の種類"
          onChange={ handleChange }
        >
          <MenuItem value={"income"}>収入</MenuItem>
          <MenuItem value={"expense"}>支出</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
        {
          isLoading ? (
            <CircularProgress />
          ) : monthlyTransactions.length > 0 ? (
            <Pie data={ data } options={ options } />
          ) : (
            <Typography>データがありません</Typography>
          )
        }
      </Box>
    </>
  )
}

export default CategoryChart