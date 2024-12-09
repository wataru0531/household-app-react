
// Home

import { Box } from "@mui/material";

import MonthlySummary from "../components/layout/MonthlySummary";
import Calendar from "../components/layout/Calendar";
import TransactionMenu from "../components/layout/TransactionMenu";
import TransactionForm from "../components/layout/TransactionForm";
import { Transaction } from "../types";

interface HomeProps {
  monthlyTransactions: Transaction[] // オブジェクトの配列
}

const Home: React.FC<HomeProps> = ({ monthlyTransactions }) => {

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={ monthlyTransactions } />
        <Calendar />
      </Box>

      {/* 右コンテンツ */}
      <Box>
        <TransactionMenu />
        <TransactionForm />
      </Box>

    </Box>
  )
}

export default Home;