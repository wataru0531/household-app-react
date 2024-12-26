

import React, { useEffect, useState } from 'react';
import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { addDoc, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { CssBaseline, ThemeProvider } from '@mui/material';

import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme'; // フォントなど
import { Transaction } from './types';
import { db } from './firebase';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';


function App() {
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);

  // 今月の月のステート
  const [ currentMonth, setCurrentMonth ] = useState<Date>(new Date());
  // console.log(currentMonth);
  // console.log(format(currentMonth, "yyyy-MM"));

  // FireStoreでのエラーなのか、一般的なエラーなのかを分ける関数
  // 型ガード
  // is演算子
  // → 関数が特定の型を返すことを TypeScript に明示的に示すことができる
  //   この構文は、型ガード と呼ばれ、関数が true を返した場合、型システムがその引数の型を絞り込むために利用される
  //   この関数が true を返した時にのみ 型を絞り込んで指定した型として扱われ、false を返した時には引数の型を絞り込まない
  //   ⭐️型ガードを活用することで、条件に応じた型絞り込みができ、型安全なコードを実現することができ
  // この場合はtrueを返した時に、errorは{ code: string, message: string } この型を持つとtypescriptに明示的に伝える
  function isFireStoreError(error: unknown): error is { code: string, message: string }{
    // errorはオブジェクトである。errorオブジェクトにはcodeが含まれている
    return typeof error === "object" && error !== null && "code" in error;
  }

  // FireStoreからデータを取得 → ステートに保持
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
    }
  }, []);

  // ひと月分(今月分)のデータのみ取得
  // transactions または currentMonth の状態が変わるたびに、再評価される
  // → 変更があれば再レンダリングされて、最新の monthlyTransactions が反映される
  //   変更されたstateがあれば、依存しているコンポーネント(この場合は AppもHomeも)が再レンダリングされる
  const monthlyTransactions = transactions.filter((transaction) => {
    // console.log(transaction); // {id: '6rblq1UPv564Xd32jdlB', category: '給与', type: 'income', date: '2024-12-09', amount: '2000', …}
    // console.log( transaction.date.startsWith(format(currentMonth, "yyyy-MM")))
    
    // 今月の月日に合致する月のデータのみstateに保持
    // formatMonth → 日付のフォーマットを変更。例: 2024-12
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  // FireStoreにデータを保存 + データのステートを更新
  const onSaveTransition = async (_transaction: Schema) => {
    try{
      // docRef → 挿入したデータを参照するオブジェクト
      const docRef = await addDoc(collection(db, "Transactions"), _transaction );
      // console.log("Document written with ID: ", docRef.id);

      // これまで保持していたデータのstateに新しく追加するデータを追加
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
  const onDeleteTransaction = async (_transactionId: string) => {
    try{
      // firestoreのデータ削除
      // doc(firebaseのdb, コレクション名, ドキュメントのid)
      await deleteDoc(doc(db, "Transactions", _transactionId));

      // リアルタイムに結果を反映
      const filteredTransactions = transactions.filter(transaction => transaction.id !== _transactionId);
      // console.log(filteredTransactions);
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


  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      
      <div className="App">
        <Router>
          <Routes>
            <Route>

              <Route path="/" element={ <AppLayout /> }>
                {/* index → /にリクエストがあれば、Homeが呼ばれる */}
                <Route 
                  index 
                  element={ 
                    <Home 
                      monthlyTransactions={ monthlyTransactions } 
                      setCurrentMonth={ setCurrentMonth }
                      onSaveTransition={ onSaveTransition }
                      onDeleteTransaction={ onDeleteTransaction }
                    />
                  }
                />

                <Route path="report" element={ <Report /> }/>
                <Route path="*" element={ <NoMatch /> }/>
              </Route>

            </Route>
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
