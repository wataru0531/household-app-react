
// サイドバー

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { NavLink } from 'react-router-dom';
import { CSSProperties } from 'react';

interface SidebarProps {
  drawerWidth: number
  mobileOpen: boolean
  handleDrawerClose: () => void
  handleDrawerTransitionEnd: () => void
}

interface menuItem {
  text: string
  path: string
  // icon: React.ReactNode
  icon: React.ComponentType // muiをReactのコンポーネント型として指定
  // React.ComponentType → Reactのコンポーネント型を表す型。React.FCの型。muiのiconはReact.FCと定義されている
  // 　　　　　　　　　　　　　React.ComponentTypeは「描画される前のプロセス」を扱うため、
  // 　　　　　　　　　　　　　React.createElementを呼び出す前の「関数やクラス」としてのコンポーネントを必要とする
  
  // React.ReactNode → Reactがレンダリング可能なすべてのものを表す型。
  //                   childrenなど「すでにレンダリング可能な形になっているもの」が対象で、関数コンポーネントそのもの(例: EqualizerIcon)は対象外
  //                   <HomeIcon /> この形はまだJSXの形でありReact要素の形であるのでReactNodeではない
  //                   → react.createElementでできた要素のこと
}

// propsはオブジェクトで渡ってくる
// const Sidebar: React.FC<SidebarProps> = (props) => {
  // console.log(props); // { drawerWidth: 240, mobileOpen: false, handleDrawerClose: ƒ, handleDrawerTransitionEnd: ƒ }

const Sidebar: React.FC<SidebarProps> = ({ 
  drawerWidth, 
  mobileOpen, 
  handleDrawerClose, 
  handleDrawerTransitionEnd

}) => {
  // console.log(<EqualizerIcon />)

  const menuItems: menuItem[] = [
    { text: "Home", path: "/", icon: HomeIcon },
    { text: "Report", path: "/report", icon: EqualizerIcon }
    // { text: "Home", path: "/", icon: HomeIcon },
    // { text: "Report", path: "/report", icon: EqualizerIcon }
  ];

  const baseLinkStyle: CSSProperties = {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  }

  const activeLinkStyle: CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  }

  // ドロワー本体
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {/* サイドバーサイドバー上で表示したい内容 */}
        { 
          menuItems.map((item, index) => (
            <NavLink 
              key={item.text}
              to={item.path} 
              style={(params) => { {/* リンクの状態が渡ってくる(react-router-domの機能) */}
                // console.log(params); //  {isActive: false, isPending: false, isTransitioning: false}
                return { 
                  ...baseLinkStyle, // プロパティを全て取り出し
                  ...(params.isActive ? activeLinkStyle : {}) // ()の中の三項演算子を先に評価 → ()がとれる。
                } 
              }}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <item.icon /> {/* ここでicon表示 */}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))
        }
      </List>
    </div>
  );

  return(
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >

      {/* スマホ用のドロワー */}
      <Drawer
        variant="temporary" // temporary 固定ではなく、クリック後に表示させる
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{ // style属性
          display: { xs: 'block', sm: 'none' }, // xs: 0px以上, sm: 600px以上
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        { drawer }
      </Drawer>

      {/* PC時のドロワー */}
      <Drawer
        variant="permanent" // 常に固定で表示される
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}


export default Sidebar;