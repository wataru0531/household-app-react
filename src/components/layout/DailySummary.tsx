
// 右サイドバーのコンポーネント
// 収入、支出、残高
import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import { Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatting";
import { financeCalculations } from "../../utils/financeCalculations";

interface DailySummaryProps {
  dailyTransactions: Transaction[]
  columns: number
}

const DailySummary: React.FC<DailySummaryProps> = ({ 
  dailyTransactions,
  columns, 
}) => {
  // console.log(dailyTransactions); // 2) [{id: 'BgRONz7JT6mc89uZyejJ', content: 'モバイルモニター', category: '娯楽', amount: 7200, date: '2024-12-09', …}, {…}]

  // その月のその日の、収入、支出を計算して、残高をを取得
  const { income, expense, balance } = financeCalculations(dailyTransactions);
  // console.log(typeof income, income, expense, balance); // number 0 0 0
  // console.log(typeof formatCurrency(income), formatCurrency(income)); // string

  // モバイルかPCかを判定。3列ならモバイル
  const isThreeColumnsLayout = columns === 3;

  return (
    <Box>
      <Grid container spacing={2}>
        {/* 収入 */}
        {/* 全体幅は12。モバイル時は3列、PC時は1列 */}
        <Grid item xs={ isThreeColumnsLayout ? 4 : 6} display={"flex"}> 
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                収入
              </Typography>
              <Typography
                // bgcolor={(theme) => theme.palette.incomeColor.main}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all", color: (theme) => theme.palette.incomeColor.main }}
              >
                ¥{ formatCurrency(income) }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 支出 */}
        <Grid item xs={ isThreeColumnsLayout ? 4 : 6} display={"flex"}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                支出
              </Typography>
              <Typography
                // bgcolor={(theme) => theme.palette.expenseColor.main}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all", color: (theme) => theme.palette.expenseColor.main }}
              >
                ¥{ formatCurrency(expense) }
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 残高 */}
        <Grid item xs={ isThreeColumnsLayout ? 4 : 12} display={"flex"}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                残高
              </Typography>
              <Typography
                // bgcolor={(theme) => theme.palette.balanceColor.main}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: "break-all", color: (theme) => theme.palette.balanceColor.main }}
              >
                ¥{ formatCurrency(balance) }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DailySummary;

