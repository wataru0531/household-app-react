
import React, { useEffect, useState } from 'react';
import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { addDoc, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme/theme'; // フォントなど
import { Transaction } from './types';
import { db } from './firebase';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';

import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import { AppContextProvider } from './context/AppContext';
import { isFireStoreError } from './utils/errorHanding';


function App() {
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);

  // 今月の月のステート
  const [ currentMonth, setCurrentMonth ] = useState<Date>(new Date());
  // console.log(currentMonth);
  // console.log(format(currentMonth, "yyyy-MM"));

  const [ isLoading, setIsLoading ] = useState(true); // trueでローティング表示

  // 取引データを全取得 → ステートに保持
  useEffect(() => {
    try{
      const fetchTransactions = async() => {
        // querySnapshot → 指定したコレクション(この場合は "Transactions")のドキュメントを操作するための情報が格納されたオブジェクト
        // getDocs() → Firestoreから特定のコレクションをやクエリに一致する全てのドキュメントを取得
        // collection() → Firestore内の特定のコレクションを参照
        // db → このプロジェクトのデータベースを指す
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        // console.log(querySnapshot); // QuerySnapshot {_firestore: Firestore, _userDataWriter: __PRIVATE_ExpUserDataWriter, _snapshot: ViewSnapshot, metadata: SnapshotMetadata, query: CollectionReference}
        
        // docs → FirebaseSDKのクラスで、getterとしいて定義されており、QueryDocumentSnapshotオブジェクトを返す
        const transactionsData = querySnapshot.docs.map((doc) => {
          // console.log(doc); // QueryDocumentSnapshot {_firestore: Firestore, _userDataWriter: __PRIVATE_ExpUserDataWriter, _key: DocumentKey, _document: MutableDocument, _converter: null, …}
          // console.log(doc.data());
          // console.log(typeof doc.id, doc.id)
          
          return { 
            id: doc.id, // idを参照
            ...doc.data() // プロパティを展開
          } as Transaction; 
          // 型アサーション
          // → ここでは、doc.idや...doc.data()から取得できる値をtypescriptが予測/判定できないので、何の型が含まれているかを明示する
          // 　typescriptにとっては何が取得できるか予測が立たない
        });
        // console.log(transactionsData); // (2) [{id: '6rblq1UPv564Xd32jdlB', content: '銀行振込', date: '2024-12-09', category: '給与', amount: '2000', …, {…}]
        
        setTransactions(transactionsData);
      }
      // console.log(transactions); // 2) [{id: '6rblq1UPv564Xd32jdlB', amount: '2000', date: '2024-12-09', type: 'income', category: '給与' }, {…}]

      fetchTransactions();
    } catch(error) {
      if(isFireStoreError(error)){
        // Firestoreの環境によるエラー
        console.log(error);
        // console.log(error.message);
      } else {
        console.log("一般的なエラー", error);
      }
    } finally{
      setIsLoading(false);
    }
  }, []);
  // console.log(isLoading);

  // 1ヶ月分(今月)のデータ
  // transactions または currentMonth の状態が変わるたびに、再評価される
  // → 変更があれば再レンダリングされて、最新の monthlyTransactions が反映される
  //   変更されたstateがあれば、依存しているコンポーネント(この場合は AppもHomeも)が再レンダリングされる
  const monthlyTransactions = transactions.filter((transaction) => {
    // console.log(transaction); // {id: '6rblq1UPv564Xd32jdlB', category: '給与', type: 'income', date: '2024-12-09', amount: '2000', …}
    // console.log(transaction.date.startsWith(formatMonth(currentMonth)))
    
    // 今月の月日に合致する月のデータのみstateに保持
    // formatMonth → 日付のフォーマットを変更。例: 2024-12
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

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


  return (
    <AppContextProvider>
      <ThemeProvider theme={ theme }>
        {/* 
        CSSBaseLine
        → ・グローバルなスタイル（ブラウザのデフォルトスタイルをリセットするCSS）を提供する
          そのため、ThemeProvider の直下に置くことで、アプリ全体に一貫したスタイルリセットが適用される
          ・Material-UIを使用している場合、CssBaseline をトップレベルで適用することで、
          すべてのコンポーネントに対して統一的なスタイルが適用され、意図しないレイアウトの崩れを防げる
        */}
        <CssBaseline />
      
        <div className="App">
          <Router>
            <Routes>
              <Route>

                <Route path="/" element={ <AppLayout /> }>
                  {/* 
                    index → /にリクエストがあれば、Homeが呼ばれる 
                    この中のHome、Report、NoMatchは、AppLayoutの中の Outlet として呼び出される
                  */}
                  <Route 
                    index 
                    element={ 
                      <Home 
                        monthlyTransactions={ monthlyTransactions } 
                        setCurrentMonth={ setCurrentMonth }
                        onSaveTransaction={ onSaveTransaction }
                        onDeleteTransaction={ onDeleteTransaction }
                        onUpdateTransaction={ onUpdateTransaction }
                      />
                    }
                  />

                  <Route
                    path="report" 
                    element={ 
                      <Report
                        currentMonth={ currentMonth }
                        setCurrentMonth={ setCurrentMonth }
                        monthlyTransactions={ monthlyTransactions }
                        isLoading={ isLoading }
                        onDeleteTransaction={ onDeleteTransaction }
                      /> 
                    }
                    />

                  <Route path="*" element={ <NoMatch /> }/>
                </Route>

              </Route>
            </Routes>
          </Router>
        </div>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
