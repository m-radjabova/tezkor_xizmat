import type { IconType } from 'react-icons'
import {
  HiBars3,
  HiOutlineArrowPathRoundedSquare,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
  HiOutlineBanknotes,
  HiOutlineBellAlert,
  HiOutlineChartBarSquare,
  HiOutlineChartPie,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineCreditCard,
  HiOutlineFolder,
  HiOutlineHome,
  HiOutlineWallet,
} from 'react-icons/hi2'

export interface NavigationItem {
  to: string
  labelKey: string
  icon: IconType
}

export const sidebarItems: NavigationItem[] = [
  { to: '/dashboard', labelKey: 'dashboard', icon: HiOutlineHome },
  { to: '/analytics', labelKey: 'analytics', icon: HiOutlineChartBarSquare },
  { to: '/categories', labelKey: 'categories', icon: HiOutlineFolder },
  { to: '/transactions', labelKey: 'transactions', icon: HiOutlineBanknotes },
  { to: '/income', labelKey: 'income', icon: HiOutlineArrowTrendingUp },
  { to: '/expenses', labelKey: 'expenses', icon: HiOutlineArrowTrendingDown },
  { to: '/budgets', labelKey: 'budgets', icon: HiOutlineChartPie },
  { to: '/savings-goals', labelKey: 'savings_goals', icon: HiOutlineWallet },
  { to: '/recurring-transactions', labelKey: 'recurring', icon: HiOutlineArrowPathRoundedSquare },
  { to: '/debts', labelKey: 'debts', icon: HiOutlineCreditCard },
  { to: '/notes', labelKey: 'notes', icon: HiOutlineClipboardDocumentList },
  { to: '/notifications', labelKey: 'notifications', icon: HiOutlineBellAlert },
  { to: '/settings', labelKey: 'settings', icon: HiOutlineCog6Tooth },
]

export const mobilePrimaryNav: NavigationItem[] = [
  { to: '/dashboard', labelKey: 'dashboard', icon: HiOutlineHome },
  { to: '/transactions', labelKey: 'transactions', icon: HiOutlineBanknotes },
  { to: '/budgets', labelKey: 'budgets', icon: HiOutlineChartPie },
  { to: '/analytics', labelKey: 'analytics', icon: HiOutlineChartBarSquare },
]

export const mobileMoreNavIcon = HiBars3
