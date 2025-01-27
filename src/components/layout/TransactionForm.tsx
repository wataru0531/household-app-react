
// 入力フォーム
// モーダルとして表示

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood"; //食事アイコン
import AlarmIcon from "@mui/icons-material/Alarm";
import AddHomeIcon from "@mui/icons-material/AddHome";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import WorkIcon from "@mui/icons-material/Work";
import SavingsIcon from "@mui/icons-material/Savings";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ExpenseCategoryType, IncomeCategoryType, Transaction } from "../../types";
import { transactionSchema, Schema } from "../../validations/schema";
import { useAppContext } from "../../context/AppContext";


interface TransactionFormProps {
  isEntryDrawerOpen: boolean
  onCloseForm: () => void
  currentDay: string
  // onSaveTransaction: (_transaction: Schema) => Promise<void>
  // onDeleteTransaction: (_transactionsId: string | readonly string[]) => Promise<void>
  selectedTransaction: Transaction | null
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>
  // onUpdateTransaction: (transaction: Schema, _transactionId: string) => Promise<void>
  // isMobile: boolean
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type IncomeExpenseType = "income" | "expense";
interface CategoryItemType {
  label: IncomeCategoryType | ExpenseCategoryType
  icon: JSX.Element // React要素としての型
}


const TransactionForm: React.FC<TransactionFormProps> = ({ 
  isEntryDrawerOpen,
  onCloseForm,
  currentDay,
  // onSaveTransaction,
  // onDeleteTransaction, // 削除
  selectedTransaction,
  setSelectedTransaction,
  // onUpdateTransaction,
  // isMobile,
  isDialogOpen,
  setIsDialogOpen,
}) => {

  const { onSaveTransaction, onDeleteTransaction, onUpdateTransaction, isMobile } = useAppContext();
  // console.log(context);



  // console.log(currentDay);
  // console.log(selectedTransaction);
  const formWidth = 320;

  // React-Hook-Formの初期化
  const { 
    control, // RHFが内部でフォームの状態(値、エラーメッセージなど)を管理するためのオブジェクト
    handleSubmit,
    formState: { errors },
    setValue, // controlが管理している特定のフィールドの値を更新する関数
    watch,
    reset,
  } = useForm<Schema>({
    defaultValues: { // 初期値
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: "",
    },
    resolver: zodResolver(transactionSchema),
    // → React Hook Form(RHF)で外部のバリデーションライブラリ(例えばZodやYupなど)と連携するためのプロパティ。
    //   resolverを使用することで、RHFのフォームバリデーションをより柔軟に、外部ライブラリのバリデーション機能を統合して利用できる
  });
  // console.log(errors); // {content: {message: '内容は50文字以内にしてください', type: 'too_big', ref: {…}}}
  // console.log(control); // {register: ƒ, unregister: ƒ, getFieldState: ƒ, handleSubmit: ƒ, setError: ƒ, …}

  // 収入、支出のボタンのvalueを切り替える
  const incomeExpenseToggle = (_type: IncomeExpenseType) => {
    // RHFの内部で管理している項目に値を入れる
    setValue("type", _type);

    // 収支typeの切り替えで、各項目をリセット
    setValue("category", "");
    setValue("amount", 0);
    setValue("content", "");
  }

  // 日付を設定
  useEffect(() => {
    setValue("date", currentDay);
  }, [ currentDay ]); // 日付に変更があればuseEffectは発火

  // typeの状態を監視
  const currentType = watch("type"); // watch muiの監視モジュール
  // console.log(currentType);

  // 支出カテゴリのアイコン
  const expenseCategories: CategoryItemType[] = [
    { label: "食費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "日用品", icon: <AlarmIcon fontSize="small" /> },
    { label: "住居費", icon: <AddHomeIcon fontSize="small" /> },
    { label: "交際費", icon: <Diversity3Icon fontSize="small" /> },
    { label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
    { label: "交通費", icon: <TrainIcon fontSize="small" /> },
  ];

  // 収入カテゴリのアイコン
  const incomeCategories: CategoryItemType[] = [
    { label: "給与", icon: <WorkIcon fontSize="small" /> },
    { label: "副収入", icon: <SavingsIcon fontSize="small" /> },
    { label: "お小遣い", icon: <AddBusinessIcon fontSize="small" /> }
  ];

  const [ categories, setCategories ] = useState(expenseCategories);
  // console.log(categories); // 6) [ { label: '食費', icon: {…} }, {…}, {…}, {…}, {…}, {…} ]

  // カテゴリ一覧をincomeの時かexpenseの時とで切り替える
  useEffect(() => {
    const newCategories = currentType === "expense" ? expenseCategories : incomeCategories;
    // console.log(newCategories);
    setCategories(newCategories);
  }, [ currentType ]); // currentTypw → income、expense

  // 送信処理
  // → 更新と追加で分岐
  const onSubmit:SubmitHandler<Schema> =  async (data) => {
    // console.log(data); 
    // // { type: 'expense', date: '2024-12-23', amount: 200, content: 'テスト', category: '食費'}
    
    // カードの取引が選択されていれば更新処理が走る
    if(selectedTransaction){
      // console.log("更新")
      onUpdateTransaction(data, selectedTransaction.id)
      .then(() => {
        setSelectedTransaction(null);

        if(isMobile) setIsDialogOpen(false); // Dialogを閉じる
      })
      .catch(error => { console.error(error); })


    } else {
      // console.log("保存")
      // FireStoreにデータを追加
      await onSaveTransaction(data); 
    }

    // 全ての項目をデフォルトでリセット
    // 今日ではない日にちで、リセットした場合、その日の日付が今日(currentDay)になってしまう。
    reset({ 
      type: "expense",
      date: currentDay, // フォームフィールドの内容をデフォルトに
      amount: 0,
      category: "",
      content: "",
    }); 
  }


  // ⭐️TODO セクション8、60
  // useEffect(() => {
  //   // console.log("useEffect")
  //   // 選択肢が更新されてかを確認
  //   if(selectedTransaction){
  //     // some ... 条件色が正しければtrueを返す
  //     // 選択された取引のカテゴリー名と一致するカテゴリー名を選択肢が持っている場合は選択肢が更新されたということ
  //     const categoryExists = categories.some(category => 
  //       category.label === selectedTransaction?.category
  //     );
      
  //     // カテゴリーの選択肢が更新された場合にカテゴリーフィールドに値を代入する
  //     setValue("category", categoryExists ? selectedTransaction.category : "");

  //   }
  //   // 初回読み込み、カードが選択された場合、収支typeが選択されたときに発火
  // }, [ selectedTransaction, categories ]);


  // 各カードのデータをクリック時にフォームに反映する
  // → 各カテゴリの項目が反映されてから、カテゴリの項目が反映される
  //   これではエラーが出るので、まずカテゴリを各項目にセットしてから、カテゴリに挿入する
  useEffect(() => {
    if(selectedTransaction){
      const { type, category, amount, date, content } = selectedTransaction;

      setValue("type", type);
      setValue("date", date);
      setValue("category", category);
      setValue("amount", amount);
      setValue("content", content);
    } else { // nullの時
      reset({
        type: "expense",
        date: currentDay,
        amount: 0,
        category: "",
        content: "",
      })
    }
  }, [ selectedTransaction ]); // 選択したデータのステートが更新した時にuseEffectを発火

  // フォームの中をリセットする処理 → firestoreからドキュメントを削除
  const handleDelete = async () => {
    if(selectedTransaction){
      await onDeleteTransaction(selectedTransaction.id);

      setSelectedTransaction(null); // 選択したデータのステートを空にする

      if(isMobile){
        setIsDialogOpen(false); // Dialogを閉じる
      }
      
    }
  }

  // フォームの
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={ onCloseForm }
          sx={{ color: (theme) => theme.palette.grey[500], }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* フォーム要素 React-hook-form */}
      <Box component={"form"} onSubmit={ handleSubmit(onSubmit) }>
        <Stack spacing={2}>

          {/* 
            Controller → React-hook-formとmuiを統合 
            ...外部のUIコンポーネント(TextField や Button など)と
              React Hook Formのフォームの状態と連携させるためのラッパーコンポーネント
            
            control
            → React Hook Formが内部でフォームの状態(値、エラーメッセージなど)を管理するためのオブジェクト。
              Controllerのcontrolプロパティに渡す
              基本的に値の更新などが行われるとcontrolがレンダリングされて状態を保持していく仕組み

            render
            →　コールバックを受け取り、fieldオブジェクトを利用してUIコンポーネントをレンダリングする
              レンダリングすることで、controlの状態がfieldに渡る仕組み
              状態が変化するとその都度レンダリングされるのでrenderとしている。
              
            field → 各フィールドの状態とメソッド(value、onChange、onBlur など)が含まれる
          */}
          <Controller
            name="type" // RHFで管理する時の名前。収支(income, expense)を管理。
            control={ control } // control が状態を管理 → renderでレンダリングされると、fieldに状態が渡る
            render={ ({ field }) => {
              // console.log(field); // { name: 'type', value: 'expense', onChange: ƒ, onBlur: ƒ, ref: ƒ }

              return(
                // field → フォームの状態を管理するデータ
                <ButtonGroup fullWidth>
                  <Button
                    onClick={ () => incomeExpenseToggle("expense") }
                    // contained: 塗りつぶし。outlined: 枠線のみ
                    variant={ field.value === "expense" ? "contained" : "outlined" } 
                    color="error" // 赤
                  >支出
                  </Button>
                  <Button 
                    onClick={ () => incomeExpenseToggle("income") }
                    variant={ field.value === "income" ? "contained" : "outlined" }
                    color="primary" // デフォルトでprimary。青
                  >収入
                  </Button>
                </ButtonGroup>
              )
            }}
          />

          <Controller
            name="date" // 日付
            control={ control }
            render={({ field }) => {
              // console.log(field); // {name: 'date', value: undefined, onChange: ƒ, onBlur: ƒ, ref: ƒ}
              
              return (
                // TextField
                // → 内部的に<input>または<textarea>を使用していて、タイプに応じて適切なHTML要素をレンダリング
                <TextField
                  { ...field } // ここでデータを展開する
                  label="日付"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // error={ true } // trueならエラーとなる
                  // errors.dateならその文字列が入ってしまうので、booleanに変換
                  error={ !!errors.date }
                  helperText={ errors.date?.message } // エラーメッセージ
                />
              )
            }}
          />

          {/* カテゴリ */}
          <Controller
            name= "category"
            control={ control }
            render={({ field }) => {
              // console.log(field);

            return (
              // fieldオブジェクトのvalueに、MenuItemで選んだvalueに格納される
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-select-label">カテゴリ</InputLabel>
                <Select
                  { ...field }
                  labelId="category-select-label"
                  id="category-select"
                  label="カテゴリ"
                >
                  {
                    categories.map(category => (
                      <MenuItem key={ category.label } value={ category.label }>
                        <ListItemIcon>
                          { category.icon }
                        </ListItemIcon>
                        { category.label }
                      </MenuItem>
                    ))
                  }
                </Select>
                <FormHelperText>{ errors.category?.message }</FormHelperText>
              </FormControl>
              )
            }}
          />
          

          {/* 金額 */}
          <Controller
            name="amount"
            control={ control }
            render={({ field }) => {
              // console.log(field); // {name: 'amount', value: 0, onChange: ƒ, onBlur: ƒ, ref: ƒ}
              
              return (
                <TextField 
                  { ...field }
                  value={ field.value === 0 ? "" : field.value  }
                  onChange={(e) => {
                    // inputを使えばデフォルトで文字列での入力となるので、onChangeを使って数値型に変換していく
                    // → 全ての数値を削除するとから文字となりエラーエラーとなるので0を保険として設定
                    //   第２引数で10進数とする
                    //   → parseIntが動作する際にデフォルトで10進数と仮定されない場合があるため
                    //     
                    const newValue = parseInt(e.target.value, 10) || 0;
                    field.onChange(newValue);
                    // → controlに通知され、値などの状態が更新される
                  }}
                  label="金額" 
                  type="number" 
                  error={ !!errors.amount }
                  helperText={ errors.amount?.message }
                />
              )
            }}
          />
        
          {/* 内容 */}
          <Controller
            name="content"
            control={ control }
            render={({ field }) => (
              <TextField 
                { ...field } 
                label="内容" 
                type="text" 
                error={ !!errors.content }
                helperText={ errors.content?.message }
              />
            )}
          />
          
          {/* 保存ボタン → RHFでは管理しない */}
          <Button 
            type="submit" 
            variant="contained" 
            color={ currentType === "income" ? "primary" : "error"} 
            fullWidth
          >
            { selectedTransaction ? "更新" : "保存" }
          </Button>

          { 
            // 削除ボタン
            // transactionが選択されている場合のみ表示
            selectedTransaction && (
              <Button 
                onClick={ () => handleDelete() }
                variant="outlined"
                color={ "secondary"} 
                fullWidth
              >
                削除
              </Button>
            )
          }
          
        </Stack>
      </Box>
    </>
  )


  return (
    <>
      {
        isMobile ? (  
          // モバイル →　ダイアログを使う
          <Dialog 
            open={ isDialogOpen } // 初期値はfalse
            fullWidth
            maxWidth={"sm"}
            onClose={ onCloseForm }
          >
            <DialogContent>
              { formContent }
            </DialogContent>
          </Dialog>

        ) : (
          // PC
          <Box 
            sx={{
              position: "fixed",
              top: 64,
              right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
              width: formWidth,
              height: "100%",
              bgcolor: "background.paper",
              zIndex: (theme) => theme.zIndex.drawer - 1,
              // フォームの開閉のアニメーション
              transition: (theme) => 
                theme.transitions.create("right", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              p: 2, // 内部の余白
              boxSizing: "border-box", // ボーダーとパディングをwidthに含める
              boxShadow: "0px 0px 15px -5px #777777",
            }}
          >

            { formContent }
            
          </Box>
        )
      }
    </>

    
  );
};
export default TransactionForm;
