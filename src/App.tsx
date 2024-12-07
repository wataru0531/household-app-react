

import React, { useEffect, useState } from 'react';
import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { collection, getDocs } from 'firebase/firestore';
import { CssBaseline, ThemeProvider } from '@mui/material';

import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme'; // フォントなど
import { Transaction } from './types';
import { db } from './firebase';

function App() {
  // console.log(Home);
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);

  useEffect(() => {
    try{
      const fetchTransactions = async() => {
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        // console.log(querySnapshot); // QuerySnapshot {_firestore: Firestore, _userDataWriter: __PRIVATE_ExpUserDataWriter, _snapshot: ViewSnapshot, metadata: SnapshotMetadata, query: CollectionReference}
        
        const transactionsData = querySnapshot.docs.map((doc) => {
          // console.log(doc); // QueryDocumentSnapshot {_firestore: Firestore, _userDataWriter: __PRIVATE_ExpUserDataWriter, _key: DocumentKey, _document: MutableDocument, _converter: null, …}
          // console.log(doc.data());
          // console.log(typeof doc.id, doc.id)
          
          return { 
            id: doc.id,
            ...doc.data() // プロパティを展開
          } as Transaction; 
          // 型アサーション
          // → ここでは、doc.id、...doc.data()から取得できる値をtypescriptが判定できないので、何の型が含まれているかを明示してやる
        });
        console.log(transactionsData); // (2) [{id: '6rblq1UPv564Xd32jdlB', content: '銀行振込', date: '2024-12-09', category: '給与', amount: '2000', …, {…}]
        
        setTransactions(transactionsData);
      }
      // console.log(transactions); // 2) [{id: '6rblq1UPv564Xd32jdlB', amount: '2000', date: '2024-12-09', type: 'income', category: '給与' }, {…}]

      fetchTransactions();

    } catch(error) {
      
    }
  }, []);

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      
      <div className="App">
        <Router>
          <Routes>
            <Route>

              <Route path="/" element={ <AppLayout /> }>
                {/* index → /にリクエストがあれば、Homeが呼ばれる */}
                <Route index element={ <Home /> }/>

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
