
// TransactionMenu (Home)
// 右コンテンツの日付、収入、支出、残高、内訳

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
import DailySummary from "./DailySummary";
import { Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatting";
import { IconComponents } from "../common/IconComponents";
import { useAppContext } from "../../context/AppContext";

interface TransactionMenuProps {
  currentDay: string // 2024-12-07
  dailyTransactions: Transaction[]
  onHandleAddTransactionForm: () => void
  onSelectTransaction: (_transaction: Transaction) => void
  // isMobile: boolean
  isMobileDrawerOpen: boolean
  handleCloseMobileDrawer: () => void
}


const TransactionMenu: React.FC<TransactionMenuProps> = ({ 
  currentDay, 
  dailyTransactions,
  onHandleAddTransactionForm,
  onSelectTransaction,
  // isMobile,
  isMobileDrawerOpen,
  handleCloseMobileDrawer,
}) => {
  // console.log(currentDay); // 今日の日付 2024-12-13
  // console.log(dailyTransactions); // 初めは空配列

  const { isMobile } = useAppContext();

  const menuDrawerWidth = 320;

  return (
    // 右サイドバー
    <Drawer
      sx={{
        width: isMobile ? "auto" : menuDrawerWidth,
        "& .MuiDrawer-paper": {
          width: isMobile ? "auto" : menuDrawerWidth, // 320px
          boxSizing: "border-box",
          p: 2,

          // ... スプレッド演算子でプロパティを抽出する
          ...(isMobile && { // モバイルサイズのスタイルを記述
            height: "80vh",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }),
          ...(!isMobile && { // モバイルサイズではない時の表示
            top: 64,
            height: `calc(100% - 64px)`, // AppBarの高さを引いたビューポートの高さ

          })
        },
      }}

      // variant → 右サイドバーを表示しいておくかどうか
      variant={ isMobile ? "temporary" : "permanent" } // permanent ... 右サイドバーが初めから固定で商事される
      anchor={ isMobile ? "bottom" : "right" }

      // 右サイドバーを表示(temporaryを指定しておいた場合はtrueで表示される)
      // → カレンダーをクリックしたら表示される
      open={ isMobileDrawerOpen } 
      onClose={ handleCloseMobileDrawer } // 閉じる処理。黒背景をクリックしたら閉じる
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {/* Stackで囲うことで、ここでは要素を縦に均等配置できる */}
      <Stack sx={{ height: "100%" }} spacing={2}>
        {/* 日付 */}
        <Typography fontWeight={"fontWeightBold"}>日時：{ currentDay }</Typography>

        {/* 収入、支出、残高、内訳 */}
        <DailySummary 
          dailyTransactions={ dailyTransactions }
          columns={ isMobile ? 3 : 2 } // モバイルの時は3列、PCの時は2列
        />

        {/* 内訳タイトル & 内訳追加ボタン */}
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
                      // → このカードの取引のデータをフォームに反映する
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
