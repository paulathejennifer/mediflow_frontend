export const COLORS = {
  // Primary brand colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49'
  },
  
  // Status colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  
referralStatus: {
  submitted: '#475569',     // Muted slate blue-gray (neutral start)
  accepted:  '#3b82f6',     // Bright but pleasant blue (good visibility)
  in_transit: '#60a5fa',    // Lighter mid-blue
  received:  '#93c5fd',     // Soft light blue
  completed: '#67e8f9',     // Your existing primary cyan (keeps the highlight)
},
  // Role colors
  roles: {
    super_admin: '#7c3aed',
    facility_admin: '#0891b2',
    clinician: '#059669'
  },
  
  // Chart colors
  charts: [
    '#0ea5e9',
    '#10b981', 
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#6b7280',
    '#84cc16'
  ]
} as const
