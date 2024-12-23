
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddHomeIcon from '@mui/icons-material/AddHome';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import TrainIcon from '@mui/icons-material/Train';
import WorkIcon from '@mui/icons-material/Work';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import SavingsIcon from '@mui/icons-material/Savings';

import { IncomeCategoryType, ExpenseCategoryType } from '../../types';
// 

// IncomeCategoryType = "給与" | "副収入" | "お小遣い";
// ExpenseCategoryType = "食費" | "日用品" | "住居費" | "交際費" | "娯楽" | "交通費";

// カテゴリーに応じたアイコンを表示するためのアイコン
export const IconComponents: Record<IncomeCategoryType | ExpenseCategoryType, JSX.Element> = { // キー: 値の型
  // MUIのアイコンは内部ではReact要素として定義されているのでJSX.Element
  食費: <FastfoodIcon fontSize="small" />,
  日用品: <AlarmIcon />,
  住居費: <AddHomeIcon />,
  交際費: <Diversity3Icon />,
  娯楽: <SportsTennisIcon />,
  交通費: <TrainIcon />,
  給与: <WorkIcon />,
  副収入: <AddBusinessIcon />,
  お小遣い: <SavingsIcon />

}