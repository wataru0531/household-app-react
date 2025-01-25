
// 共通のレイアウト

import { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';

import Sidebar from '../common/Sidebar';
import { useAppContext } from "../../context/AppContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Transaction } from "../../types";
import { isFireStoreError } from "../../utils/errorHanding";

const drawerWidth = 240;


export default function AppLayout() {
  // コンテキストから値を取得
  const { setTransactions, setIsLoading } = useAppContext();

  // firestoreのデータを全て取得
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


  // ドロワーのステート
  const [ mobileOpen, setMobileOpen ] = useState(false);
  const [ isClosing, setIsClosing ] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) { // 
      setMobileOpen(!mobileOpen);
    }
  };
  
  return (
    // sx → style属性のようなもの
    // bgcolor → palleteからgreyの100を適用
    <Box sx={{ display: { md: 'flex' }, minHeight: "100vh", bgcolor: (theme) => theme.palette.grey[100] }}>
      <CssBaseline />

      {/* header */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={ handleDrawerToggle }
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Household Budgeting App
          </Typography>
        </Toolbar>
      </AppBar>
      {/* header */}

      {/* サイドバー */}
      <Sidebar 
        drawerWidth={ drawerWidth }
        mobileOpen={ mobileOpen }
        handleDrawerClose={ handleDrawerClose }
        handleDrawerTransitionEnd={ handleDrawerTransitionEnd }
      />
      {/* サイドバー */}
      
      {/* mainコンテンツ */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />

        {/* Home, report, noMatchを呼び出す */}
        <Outlet />
      </Box>
      {/* mainコンテンツ */}
    </Box>
  );
}
