
// テーブル
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import { Transaction } from '../../types';
import { financeCalculations } from '../../utils/financeCalculations';
import { Grid2 } from '@mui/material';
import { useTheme } from '@mui/material';
import { Typography } from '@mui/material';
import { formatCurrency } from '../../utils/formatting';
import { IconComponents } from '../common/IconComponents';
import { compareDesc, parseISO } from 'date-fns';

interface TransactionTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

// 取引一覧 ... テーブルヘッド: テーブルの1行目のこと
//             ボディ部分は、TableBodyで記述
// tr: table row 
// th: table head
// td: table data
function TransactionTableHead(props: TransactionTableHeadProps) {
  const { onSelectAllClick, numSelected, rowCount,} = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={ numSelected > 0 && numSelected < rowCount }
            checked={ rowCount > 0 && numSelected === rowCount }
            onChange={ onSelectAllClick }
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        <TableCell align={"left"}>日付</TableCell>
        <TableCell align={"left"}>カテゴリ</TableCell>
        <TableCell align={"left"}>金額</TableCell>
        <TableCell align={"left"}>内容</TableCell>
      </TableRow>
    </TableHead>
  );
}


interface TransactionTableToolbarProps {
  numSelected: number
  handleDelete: () => void
}

// 2段目 ツールバー
function TransactionTableToolbar({ 
  numSelected, 
  handleDelete,
}: TransactionTableToolbarProps) {

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          月の収支
        </Typography>
      )}

      {/* 取引が選択されていたらゴミ箱のアイコンを表示 */}
      {numSelected > 0 && (
          <Tooltip title="Delete">
            <IconButton onClick={ handleDelete } >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )
      }
    </Toolbar>
  );
}

interface financialTypeProps {
  title: string, 
  color: string, 
  value: number
}

// ヘッダー部分に渡すタイトルと金額のコンポーネント
function FinancialItem({ title, color, value  }: financialTypeProps){
  return (
    <Grid2 size={{ xs: 4 }} textAlign={"center"}>
      {/* variant="subtitle1" → コミ出しスタイルが適用される  */}
      <Typography variant="subtitle1">{ title }</Typography>

      <Typography 
        component={"span"} 
        fontWeight={"fontWeightBold"} 
        sx={{ 
          color: color, 
          fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
          wordBreak: "break-word"
        }}
      >
        ¥{ formatCurrency(value) }
      </Typography>
    </Grid2>
  )
}



interface TransactionTableProps {
  monthlyTransactions: Transaction[]
  onDeleteTransaction: (_transactionId: string) => Promise<void>
}

// テーブル
export default function TransactionTable({ monthlyTransactions, onDeleteTransaction }: TransactionTableProps) {
  // console.log(monthlyTransactions);

  // theme
  const theme = useTheme();
  // 取引のid
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // 
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = monthlyTransactions.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // 
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // 空の行数を取得 → 各ページで行の高さを同じにするため
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - monthlyTransactions.length) : 0;

  // テーブルのtbodyに表示する5件分のデータ
  // slice(start, end) → 指定した範囲の要素を抽出して新しい配列(または文字列)を返す
  //                     start: 抽出を開始するインデックス
  //                     end:   抽出を終了するインデックス(このインデックスは含まれない)
  // useMemo() → 第２引数の[]の中が変更された時のみ再レンダリングされる
  const visibleRows = React.useMemo(() => {
    // 降順 10 9 8 7
    const sortedMonthlyTransactions = [...monthlyTransactions].sort((a, b) => {
      // compareDesc() → 2つの日付を比較し、降順（新しい日付が先）で並べる
      // parseISO → ISO 8601 形式の文字列を Dateオブジェクトに変換
      //               ISO 8601 →　日付と時刻の国際的な標準フォーマット。YYYY-MM-DD や YYYY-MM-DDTHH:mm:ssZ などの形式
      // console.log(a.date, parseISO(a.date)); // 2025-01-01, Wed Jan 01 2025 00:00:00 GMT+0900 (日本標準時) ... Dateオブジェクトの文字列
      return compareDesc(parseISO(a.date), parseISO(b.date));
    });

    return sortedMonthlyTransactions.slice( // 5件分のデータを取得
      page * rowsPerPage,  // 0, 次のページは5
      page * rowsPerPage + rowsPerPage // 5, 次のページは10
    )
  }, [ page, rowsPerPage, monthlyTransactions ]);
  // console.log(rows); // (13) [ {id: 1, name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, …}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
  // console.log(visibleRows); // (5) [{id: 'Bx9mXMFLNws9Y5FGf3qV', amount: 1000, content: '鯖', date: '2025-01-01', category: '食費', …}, {…}, {…}, {…}, {…}]

  // その月の収支を取得
  // console.log(monthlyTransactions);
  const { income, expense, balance } = financeCalculations(monthlyTransactions);
  // console.log(income, expense, balance); // 50335 42520 7815

  // 削除
  // console.log(selected); // ['RmyQ8n1hDndNoJP8a6Yx'] 複数選択可能
  const handleDelete = () => {
    // console.log("delete");
    // console.log(selected)

    // onDeleteTransaction()

    setSelected([]);
  }


  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>

        {/* 収支表示エリア */}
        <Grid2 
          container
          sx={{ borderBottom: "1px solid rgba(224, 224, 224, 1)" }}
        >
          <FinancialItem title={"収入"} value={ income } color={ theme.palette.incomeColor.main } />
          <FinancialItem title={"支出"} value={ expense } color={ theme.palette.expenseColor.main } />
          <FinancialItem title={"残高"} value={ balance } color={ theme.palette.balanceColor.main } />
        </Grid2>

        {/* ツールバー */}
        <TransactionTableToolbar 
          numSelected={selected.length} 
          handleDelete={ handleDelete }
        />

        {/* 取引一覧 */}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >

            {/* テーブルのヘッダー部分 → thead */}
            <TransactionTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={monthlyTransactions.length}
            />

            {/* テーブルのbody → tbody */}
            <TableBody>
              {visibleRows.map((transaction, index) => {
                const isItemSelected = selected.includes(transaction.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                // 1行のTableCellとして返している
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, transaction.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={transaction.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {transaction.date}
                    </TableCell>
                    <TableCell align="left" sx={{display: "flex", alignItems: "center"}}>
                      <Box sx={{ marginRight: "10px" }}>
                      { IconComponents[transaction.category] }
                      </Box>
                      {transaction.category}
                    </TableCell>
                    <TableCell align="left">{transaction.amount}</TableCell>
                    <TableCell align="left">{transaction.content}</TableCell>
                  </TableRow>
                );
              })}
              {/* 
                空の行が存在する場合、その空の行分高さを指定して、空の行を挿入
                → 各ページ行は5行で、高さを揃えるため
              */}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows, // 53px
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

          </Table>
        </TableContainer>

        {/* ページネーション */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={ monthlyTransactions.length }
          rowsPerPage={ rowsPerPage }
          page={ page }
          onPageChange={ handleChangePage }
          onRowsPerPageChange={ handleChangeRowsPerPage }
        />
      </Paper>

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
