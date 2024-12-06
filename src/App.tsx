

import React from 'react';
import {  BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme'; // フォントなど
import { CssBaseline, ThemeProvider } from '@mui/material';

function App() {
  // console.log(Home);

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
