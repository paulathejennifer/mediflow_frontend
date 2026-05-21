export interface TrendData {
  value: string
  isPositive: boolean
}

export function calculateTrend(current: number, previous: number): TrendData {
  if (previous === 0) {
    return { value: '+0%', isPositive: true }
  }

  const change = ((current - previous) / previous) * 100
  const isPositive = change >= 0

  return {
    value: `${isPositive ? '+' : ''}${change.toFixed(1)}%`,
    isPositive
  }
}

export function getDateRange(daysAgo: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - daysAgo)

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

export function getPreviousDateRange(daysAgo: number, previousDays: number): { start: string; end: string } {
  const end = new Date()
  end.setDate(end.getDate() - daysAgo)
  const start = new Date()
  start.setDate(start.getDate() - (daysAgo + previousDays))

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}
