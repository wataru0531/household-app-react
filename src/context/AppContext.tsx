
// コンテキスト


import { createContext, useContext, useState } from "react";
import { Transaction } from "../types";
import { useMediaQuery, useTheme } from "@mui/material";
import { Schema } from "../validations/schema";
import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { isFireStoreError } from "../utils/errorHanding";

interface AppContextType {
  transactions: Transaction[]
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
  currentMonth: Date
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean,
  onSaveTransaction: (_transaction: Schema) => Promise<void>
  onDeleteTransaction: (_transactionIds: string | readonly string[]) => Promise<void>
  onUpdateTransaction: (_transaction: Schema, _transactionId: string) => Promise<void>
}

// 
export const AppContext = createContext<AppContextType | undefined>(undefined);


interface AppContextProviderPropsType {
  children: React.ReactNode
}
export const AppContextProvider: React.FC<AppContextProviderPropsType> = ({ children }) => {

  const [ transactions, setTransactions ] = useState<Transaction[]>([]);
  const [ currentMonth, setCurrentMonth ] = useState<Date>(new Date());
  const [ isLoading, setIsLoading ] = useState(true); // trueでローティング表示
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

   // FireStoreにデータを保存 + データのステートを更新
  const onSaveTransaction = async (_transaction: Schema) => {
    try{
      // docRef → 挿入したデータを参照するオブジェクト
      const docRef = await addDoc(collection(db, "Transactions"), _transaction );
      // console.log("Document written with ID: ", docRef.id);

      // これまで保持していた transactions に新しく追加するデータを追加
      const newTransaction = {
        id: docRef.id, // id
        ..._transaction
      } as Transaction;
      // console.log(newTransaction); // {id: 'YCr1IV0lNZOnfXU5r4WQ', type: 'expense', date: '2024-12-23', amount: 40000, content: '家賃', …}

      // console.log(transactions)
      // もともとのtransactionの配列にFireStoreに保存したデータを追加する
      setTransactions(prevTransaction => [
        ...prevTransaction, // 前のステート
        newTransaction      // 新しいステート
      ]);

    } catch(error){
      if(isFireStoreError(error)){
        console.log("FireStoreのエラーは: ", error);
      } else {
        console.log("一般的なエラーは: ", error);
      }
    }
  }
  // console.log(monthlyTransactions); // 2) [{id: '6rblq1UPv564Xd32jdlB', type: 'income', content: '銀行振込', amount: '2000', date: '2024-12-09', …}}, {…}]

  // firestoreからドキュメントを削除する処理。フォームの項目をリセットする処理 
  // 配列にも対応
  // readonly → 配列の中の要素の変更を防ぐ。
  const onDeleteTransaction = async (_transactionIds: string | readonly string[]) => {
    try{
      // 複数ならそのまま配列で、単一なら配列にする
      const idsToDelete = Array.isArray(_transactionIds) ? _transactionIds : [_transactionIds] 
      // console.log(idsToDelete);

       // firestoreのデータ削除
      for(const id of idsToDelete){ 
        // doc(firebaseのdb, コレクション名, ドキュメントのid)
        await deleteDoc(doc(db, "Transactions", id));
      }

      // リアルタイムに結果を反映
      const filteredTransactions = transactions.filter(transaction => {
        // idsToDelete配列の中で、transaction.idとは一致しない要素のみを取り出す
        return !idsToDelete.includes(transaction.id);
      });

      setTransactions(filteredTransactions);
       // → ステートを更新すると再レンダリングの仕組みが働くのでリアルタイムに更新される

    } catch(error){
      if(isFireStoreError(error)){
        console.error("firestoreのエラーは: ", error);
      } else {
        console.error("一般的なエラーは: ", error);
      }
    }
  }

  // Firestoreのデータを更新する処理
  const onUpdateTransaction = async (_transaction: Schema, _transactionId: string) => {
    try{
      const updateRef = doc(db, "Transactions", _transactionId); // 更新対象を取得

      await updateDoc(updateRef, _transaction);

      // transactionsのステートを更新してリアルタイムに反映する
      const updatedTransactions = transactions.map(transaction => (
        // idが同じtransactionのみを更新する。更新されているプロパティが更新される。
        transaction.id === _transactionId ? { ...transaction, ..._transaction }
                                          : transaction
      )) as Transaction[];
      // → setTransactionsでは、categoryで空文字を許容していないが、updatedTransactionsでは空文字を許容してしまっているため

      setTransactions(updatedTransactions); 
      // → transactionsをトップレベルのここで更新すると再レンダリングされるためリアルタイムに更新される

    } catch(error){
      if(isFireStoreError(error)){
        console.error("Firestoreのエラー: ", error);
      } else {
        console.error("一般的なエラー: ", error);
      }
    } 
  }

  // プロバイダーの外部でコンテキストの値を取得しようとするとエラーとなる
  // const context = useAppContext(); 


  return(
    <AppContext.Provider value={{ 
      transactions, // キーと値が同じなら省略できる
      setTransactions,
      currentMonth,
      setCurrentMonth,
      isLoading, 
      setIsLoading,
      isMobile,
      onSaveTransaction,
      onDeleteTransaction,
      onUpdateTransaction
    }}>
      { children }
    </AppContext.Provider>
  )
}


// カスタムフック 
// コンテキストのデータが取得できたかどうか
export const useAppContext = () => {
  const context = useContext(AppContext); // コンテキストをここで取得

  if(!context){
    // コンテキストでデータが取得できない(undefined)時
    throw new Error("グローバルなデータはプロバイダーの中で取得してください")
  }
  return context;
}