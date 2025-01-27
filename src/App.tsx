
import { useEffect } from 'react';
import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { collection, getDocs } from 'firebase/firestore';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme/theme'; // フォントなど
import { Transaction } from './types';
import { db } from './firebase';

import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import { useAppContext } from './context/AppContext';
import { isFireStoreError } from './utils/errorHanding';


function App() {
  const { setTransactions, setIsLoading } = useAppContext();

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
        console.log(transactionsData); // (2) [{id: '6rblq1UPv564Xd32jdlB', content: '銀行振込', date: '2024-12-09', category: '給与', amount: '2000', …, {…}]
        
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

  return (
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
                      // monthlyTransactions={ monthlyTransactions } 
                      // setCurrentMonth={ setCurrentMonth }
                      // onSaveTransaction={ onSaveTransaction }
                      // onDeleteTransaction={ onDeleteTransaction }
                      // onUpdateTransaction={ onUpdateTransaction }
                    />
                  }
                />
                <Route
                  path="report" 
                  element={ 
                    <Report
                      // currentMonth={ currentMonth }
                      // setCurrentMonth={ setCurrentMonth }
                      // monthlyTransactions={ monthlyTransactions }
                      // isLoading={ isLoading }
                      // onDeleteTransaction={ onDeleteTransaction }
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

)}

export default App;
