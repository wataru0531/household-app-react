

// MonthlySummary (Home)
// 収入(青)、支出(赤)、残高(緑)

import { Card, CardContent, Stack, Typography } from "@mui/material";
// Gridからのimportだとエラーがでる。
import Grid from "@mui/material/Grid2";

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Transaction } from "../../types";
import { financeCalculations } from "../../utils/financeCalculations";

// 今月のデータ
interface MonthlySummaryProps {
  monthlyTransactions: Transaction[]
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ monthlyTransactions }) => {
  // console.log(monthlyTransactions); // (2) [{id: '6rblq1UPv564Xd32jdlB', type: 'income', date: '2024-12-09', content: '銀行振込', amount: '2000', …}, {…}]

  // その月のデータから、収入、支出、残高を算出
  const { income, expense, balance } = financeCalculations(monthlyTransactions);
  // console.log({ income, expense, balance });

  return(
    <Grid container mb={2} spacing={{ xs: 1, sm: 2 }}>

      {/* 収入 */}
      <Grid size={{ xs: 4 }} display={"flex"} flexDirection={"column"}>
        <Card sx={{ 
          flexGrow: 1, 
          // themeは内部で自動的にthemeオブジェクトが渡ってくる仕様
          bgcolor: (theme) => theme.palette.incomeColor.main, 
          color: "white",
          borderRadius: "10px" 
        }}>
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <ArrowUpwardIcon sx={{ fontSize: "2rem" }} />
              <Typography>収入</Typography>
            </Stack>
            <Typography 
              textAlign={"right"} 
              variant="h5" 
              fontWeight={"fontWeightBold"}
              sx={{ wordBreak: "break-word", fontSize: { sx: ".8rem", sm: "1rem", md: "1.2rem" } }}
            >
              ¥{ income }
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 支出 */}
      <Grid size={{ xs: 4 }} display={"flex"} flexDirection={"column"}>
        <Card sx={{ 
          flexGrow: 1, 
          bgcolor: (theme) => theme.palette.expenseColor.main, 
          color: "white", 
          borderRadius: "10px" 
        }}>
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <ArrowDownwardIcon sx={{ fontSize: "2rem" }} />
              <Typography>支出</Typography>
            </Stack>
            <Typography 
              textAlign={"right"} 
              variant="h5" 
              fontWeight={"fontWeightBold"}
              sx={{ wordBreak: "break-word", fontSize: { sx: ".8rem", sm: "1rem", md: "1.2rem" } }}
            >
              |{ expense }
            </Typography>
          </CardContent>
        </Card>

      </Grid>

      {/* 残高 */}
      <Grid size={{ xs: 4 }} display={"flex"} flexDirection={"column"}>
        <Card sx={{ 
          flexGrow: 1, 
          bgcolor: (theme) => theme.palette.balanceColor.main, 
          color: "white", 
          borderRadius: "10px" 
        }}>
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={"row"}>
              <AccountBalanceIcon sx={{ fontSize: "2rem" }} />
              <Typography>残高</Typography>
            </Stack>
            <Typography 
              textAlign={"right"} 
              variant="h5" 
              fontWeight={"fontWeightBold"}
              sx={{ wordBreak: "break-word", fontSize: { sx: ".8rem", sm: "1rem", md: "1.2rem" } }}
            >
              ¥{ balance }
            </Typography>
          </CardContent>
        </Card>

      </Grid>

    </Grid>
  )
}

export default MonthlySummary;