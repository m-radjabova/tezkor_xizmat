import type { DateFilter } from '../context/preferences-context'
import type { TransactionItem } from '../types'

function getDateRange(filter: DateFilter) {
  const now = new Date()
  const start = new Date(now)

  if (filter === 'today') {
    start.setHours(0, 0, 0, 0)
    return { start, end: now }
  }

  if (filter === 'week') {
    const day = start.getDay()
    const diff = day === 0 ? 6 : day - 1
    start.setDate(start.getDate() - diff)
    start.setHours(0, 0, 0, 0)
    return { start, end: now }
  }

  if (filter === 'month') {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    return { start, end: now }
  }

  start.setMonth(0, 1)
  start.setHours(0, 0, 0, 0)
  return { start, end: now }
}

export function filterTransactions(
  transactions: TransactionItem[],
  period: DateFilter,
  searchTerm: string,
) {
  const query = searchTerm.trim().toLowerCase()
  const { start, end } = getDateRange(period)

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.transaction_date)
    const isInRange = transactionDate >= start && transactionDate <= end
    if (!isInRange) return false

    if (!query) return true

    const haystack = [
      transaction.title,
      transaction.description ?? '',
      ...(transaction.tags ?? []),
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
}
