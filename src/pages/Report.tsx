
// Reportページ

import { Grid2, Paper } from "@mui/material";
import MonthSelector from "../components/layout/MonthSelector";
import CategoryChart from "../components/layout/CategoryChart";
import BarChart from "../components/layout/BarChart";
import TransactionTable from "../components/layout/TransactionTable";
import { Transaction } from "../types";
// ⭐️gridは非推奨。grid2が使える
// → https://mui.com/material-ui/react-grid2/


interface ReportProps {
  currentMonth: Date
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
  monthlyTransactions: Transaction[]
  isLoading: boolean
}

const Report: React.FC<ReportProps> = ({ 
  currentMonth, 
  setCurrentMonth, 
  monthlyTransactions,
  isLoading,
}) => {
  const commonPaperStyle = {
    height: { xs: "auto", md: "400px" },
    display: "flex",
    flexDirection: "column",
    p: 2, // padding

  }

  return (
    <Grid2 container spacing={2}>
      {/* カラムは1から12。最大で12 */}
      <Grid2 size={{ xs: 12, }}>
        <MonthSelector 
          currentMonth={ currentMonth } 
          setCurrentMonth={ setCurrentMonth }
        />
      </Grid2>

      <Grid2 size={{ xs: 12, md: 4 }}>
        <Paper sx={ commonPaperStyle }>
          <CategoryChart />
        </Paper>
      </Grid2>

      <Grid2 size={{ xs: 12, md: 8 }}>
        <Paper sx={ commonPaperStyle }>
          <BarChart monthlyTransactions={ monthlyTransactions } isLoading={ isLoading } />
        </Paper>
      </Grid2>

      <Grid2 size={{ xs: 12 }}>
        <TransactionTable />
      </Grid2>

    </Grid2>
  )
}

export default Report;