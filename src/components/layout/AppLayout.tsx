
// 共通のレイアウト

import { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router-dom';

import Sidebar from '../common/Sidebar';

const drawerWidth = 240;


export default function AppLayout() {
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
    <Box sx={{ display: 'flex', minHeight: "100vh", bgcolor: (theme) => theme.palette.grey[100] }}>
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

      {/* サイドバー */}
      <Sidebar 
        drawerWidth={ drawerWidth }
        mobileOpen={ mobileOpen }
        handleDrawerClose={ handleDrawerClose }
        handleDrawerTransitionEnd={ handleDrawerTransitionEnd }
      />
      
      {/* mainコンテンツ */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />

        {/* Home, report, noMatchを呼び出す */}
        <Outlet />
        
      </Box>
    </Box>
  );
}
