import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

type SeoMeta = {
  title: string
  description: string
}

const defaultMeta: SeoMeta = {
  title: 'Budget Planner - Smart Personal Finance Tracking',
  description:
    'Track expenses, manage budgets, monitor savings goals and improve your personal finances with Budget Planner.',
}

const routeMeta: Record<string, SeoMeta> = {
  '/': defaultMeta,
  '/login': {
    title: 'Budget Planner - Sign In',
    description:
      'Sign in to Budget Planner to manage budgets, track transactions, and stay in control of your personal finances.',
  },
  '/register': {
    title: 'Budget Planner - Create Your Account',
    description:
      'Create your Budget Planner account to start tracking expenses, savings goals, budgets, and everyday financial activity.',
  },
  '/dashboard': {
    title: 'Budget Planner - Personal Finance Dashboard',
    description:
      'Track expenses, manage budgets, monitor savings goals and improve your personal finances with Budget Planner.',
  },
  '/analytics': {
    title: 'Budget Planner - Finance Analytics',
    description:
      'Analyze spending trends, income patterns, savings progress, and budget usage from one clear analytics dashboard.',
  },
  '/categories': {
    title: 'Budget Planner - Categories',
    description:
      'Organize your spending and income with custom finance categories that keep your budget planner structured and searchable.',
  },
  '/transactions': {
    title: 'Budget Planner - Transactions',
    description:
      'Track income and expenses, review cash flow, and keep every personal finance transaction easy to update.',
  },
  '/income': {
    title: 'Budget Planner - Income Tracking',
    description:
      'Monitor salary, freelance payments, and every incoming amount in one clean personal finance workspace.',
  },
  '/expenses': {
    title: 'Budget Planner - Expense Tracking',
    description:
      'Follow your spending by category, review recent expenses, and understand where your money is going.',
  },
  '/budgets': {
    title: 'Budget Planner - Budget Management',
    description:
      'Create monthly budgets, set category limits, and stay on top of your personal finance plan with clear progress tracking.',
  },
  '/savings-goals': {
    title: 'Budget Planner - Savings Goals',
    description:
      'Set savings targets, monitor contribution progress, and plan important milestones with confidence.',
  },
  '/recurring-transactions': {
    title: 'Budget Planner - Recurring Transactions',
    description:
      'Manage recurring income and expense entries so repeated financial activity stays automated and organized.',
  },
  '/debts': {
    title: 'Budget Planner - Debt Management',
    description:
      'Track balances, due dates, repayments, and outstanding debt obligations from one focused dashboard.',
  },
  '/notes': {
    title: 'Budget Planner - Notes',
    description:
      'Keep personal finance reminders, budget ideas, and planning notes close to the rest of your money workflow.',
  },
  '/notifications': {
    title: 'Budget Planner - Notifications',
    description:
      'Review budget alerts, reminders, and app notifications so important finance updates never get missed.',
  },
  '/settings': {
    title: 'Budget Planner - Settings',
    description:
      'Update your profile, preferences, language, currency, and workspace settings inside Budget Planner.',
  },
}

function getSiteUrl() {
  const envUrl = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, '')

  if (envUrl) {
    return envUrl
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return 'https://budgetplanner.com'
}

function RouteSeo() {
  const { pathname } = useLocation()
  const meta = routeMeta[pathname] ?? defaultMeta
  const siteUrl = getSiteUrl()
  const canonicalUrl = `${siteUrl}${pathname === '/' ? '' : pathname}`
  const imageUrl = `${siteUrl}/report.png`

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Budget Planner" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  )
}

export default RouteSeo
