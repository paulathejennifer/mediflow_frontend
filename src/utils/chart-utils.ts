// Common chart configurations and utilities
export const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted))',
  destructive: 'hsl(var(--destructive))',
  success: 'hsl(142, 76%, 36%)',
  warning: 'hsl(38, 92%, 50%)',
  info: 'hsl(199, 89%, 48%)'
}

export const CHART_HEIGHTS = {
  small: 200,
  medium: 320,
  large: 400,
  extraLarge: 500
}

export const commonChartProps = {
  margin: {
    top: 10,
    right: 30,
    left: 0,
    bottom: 0
  }
}

export const commonTooltipProps = {
  contentStyle: {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '6px'
  }
}

export const commonAxisProps = {
  className: 'text-muted-foreground',
  tick: { fontSize: 12 }
}

// Format numbers for charts
export const formatChartNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

// Format percentages for charts
export const formatChartPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`
}

// Generate mock data for testing
export const generateMockTrendData = (months: number, baseValue: number = 100) => {
  return Array.from({ length: months }, (_, i) => ({
    month: i.toString(),
    patients: baseValue + Math.floor(Math.random() * 50) + (i * 20),
    referrals: Math.floor(baseValue * 0.6) + Math.floor(Math.random() * 30) + (i * 15),
    documents: baseValue * 2 + Math.floor(Math.random() * 80) + (i * 40)
  }))
}

// Chart animation defaults
export const chartAnimationDefaults = {
  animationBegin: 0,
  animationDuration: 1000,
  animationEasing: 'ease-in-out' as const
}
