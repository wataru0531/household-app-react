
// TransactionMenu (Home)
// 右コンテンツの、収入、支出、残高、内訳

import React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

//アイコン
import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import DailySummary from "./DailySummary";
import { Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatting";
import { IconComponents } from "../common/IconComponents";

interface TransactionMenuProps {
  currentDay: string
  dailyTransactions: Transaction[]
  onHandleAddTransactionForm: () => void
  onSelectTransaction: (_transaction: Transaction) => void
}


const TransactionMenu: React.FC<TransactionMenuProps> = ({ 
  currentDay, 
  dailyTransactions,
  onHandleAddTransactionForm,
  onSelectTransaction,
}) => {
  // console.log(currentDay); // 今日の日付 2024-12-13
  // console.log(dailyTransactions); // 初めは空配列

  const menuDrawerWidth = 320;

  return (
    <Drawer
      sx={{
        width: menuDrawerWidth,
        "& .MuiDrawer-paper": {
          width: menuDrawerWidth,
          boxSizing: "border-box",
          p: 2,
          top: 64,
          height: `calc(100% - 64px)`, // AppBarの高さを引いたビューポートの高さ
        },
      }}
      variant={"permanent"}
      anchor={"right"}
    >
      {/* Stackで囲うことで、ここでは要素を縦に均等配置できる */}
      <Stack sx={{ height: "100%" }} spacing={2}>
        {/* 日付 */}
        <Typography fontWeight={"fontWeightBold"}>日時：{ currentDay }</Typography>

        {/* 収入、支出、残高、内訳 */}
        <DailySummary dailyTransactions={ dailyTransactions }/>

        {/* 内訳タイトル&内訳追加ボタン */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }} >
          
          {/* 左側のメモアイコンとテキスト */}
          <Box display="flex" alignItems="center">
            <NotesIcon sx={{ mr: 1 }} />
            <Typography variant="body1">内訳</Typography>
          </Box>
          {/* 右側の追加ボタン */}
          <Button 
            startIcon={<AddCircleIcon />} 
            color="primary"
            onClick={ onHandleAddTransactionForm }
          >
            内訳を追加
          </Button>
        </Box>

        {/* 取引履歴 */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="取引履歴">
            <Stack spacing={2}>
              {
                dailyTransactions.map((transaction) => (
                  <ListItem key={ transaction.id } disablePadding>
                    <Card
                      sx={{
                        width: "100%",
                        backgroundColor: (theme) =>
                          transaction.type === "expense" ? theme.palette.expenseColor.light
                                              : theme.palette.incomeColor.light
                      }}
                      onClick={ () => onSelectTransaction(transaction) }
                    >
                      <CardActionArea>
                        <CardContent>
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            wrap="wrap"
                          >
                            <Grid item xs={1}>
                              {/* icon */}
                              { IconComponents[transaction.category] }

                            </Grid>
                            <Grid item xs={2.5}>
                              <Typography
                                variant="caption"
                                display="block"
                                gutterBottom
                              >
                                { transaction.category }
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2" gutterBottom>
                                { transaction.content }
                              </Typography>
                            </Grid>
                            <Grid item xs={4.5}>
                              <Typography
                                gutterBottom
                                textAlign={"right"}
                                color="text.secondary"
                                sx={{
                                  wordBreak: "break-all",
                                }}
                              >
                                ¥{ formatCurrency(transaction.amount) }
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </ListItem>
                ))

              }
              
            </Stack>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default TransactionMenu;
