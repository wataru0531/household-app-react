

import React, { useEffect, useState } from 'react';
import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { collection, getDocs } from 'firebase/firestore';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { format } from "date-fns";

import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme'; // フォントなど
import { Transaction } from './types';
import { db } from './firebase';
import { formatMonth } from './utils/formatting';

function App() {
  // console.log(Home);
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);

  // 今月の月のステート
  const [ currentMonth, setCurrentMonth ] = useState<Date>(new Date());
  // console.log(currentMonth);
  // console.log(format(currentMonth, "yyyy-MM"));



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

  useEffect(() => {
    try{
      const fetchTransactions = async() => {
        // querySnapshot → 指定したコレクション(この場合は "Transactions")のドキュメントを操作するための情報が格納されたオブジェクト
        // getDocs() → Firestoreから特定のコレクションをやクエリに一致する全てのドキュメントを取得する
        // collection() → Firestore内の特定のコレクションを参照
        // db → このプロジェクトのデータベースを指す
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        // console.log(querySnapshot); // QuerySnapshot {_firestore: Firestore, _userDataWriter: __PRIVATE_ExpUserDataWriter, _snapshot: ViewSnapshot, metadata: SnapshotMetadata, query: CollectionReference}
        
        // docs → FirebaseSDKのクラスで、getterとしいて定義されており、QueryDocumentSnapshotオブジェクトを返す
        // data() → 同様にgetterでドキュメントを返すようになっている
        const transactionsData = querySnapshot.docs.map((doc) => {
          // console.log(doc); // QueryDocumentSnapshot {_firestore: Firestore, _userDataWriter: __PRIVATE_ExpUserDataWriter, _key: DocumentKey, _document: MutableDocument, _converter: null, …}
          // console.log(doc.data());
          // console.log(typeof doc.id, doc.id)
          
          return { 
            id: doc.id, // 
            ...doc.data() // プロパティを展開
          } as Transaction; 
          // 型アサーション
          // → ここでは、doc.id、...doc.data()から取得できる値をtypescriptが判定できないので、何の型が含まれているかを明示してやる
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

  // 今月のデータのみ取得
  const monthlyTransactions = transactions.filter((transaction) => {
    // console.log(transaction); // {id: '6rblq1UPv564Xd32jdlB', category: '給与', type: 'income', date: '2024-12-09', amount: '2000', …}
    // console.log( transaction.date.startsWith(format(currentMonth, "yyyy-MM")))
    
    // 日付のフォーマットを変更
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  // console.log(monthlyTransactions); // 2) [{id: '6rblq1UPv564Xd32jdlB', type: 'income', content: '銀行振込', amount: '2000', date: '2024-12-09', …}}, {…}]

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      
      <div className="App">
        <Router>
          <Routes>
            <Route>

              <Route path="/" element={ <AppLayout /> }>
                {/* index → /にリクエストがあれば、Homeが呼ばれる */}
                <Route index element={ <Home monthlyTransactions={ monthlyTransactions } /> }/>

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
