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
  
// Referral status colors
  referralStatus: {
    submitted: '#475569',     // Muted slate blue-gray (neutral start)
    accepted:  '#3b82f6',     // Bright but pleasant blue (good visibility)
    in_transit: '#60a5fa',    // Lighter mid-blue
    received:  '#93c5fd',     // Soft light blue
    completed: '#67e8f9',     // Your existing primary cyan (keeps the highlight)
  },
  
  // Gender colors
  gender: {
    male: '#3b82f6',      // Blue
    female: '#ec4899',    // Pink  
    other: '#8b5cf6'      // Purple
  },
  
  // Status badge colors
  statusBadge: {
    active: '#10b981',    // Green (keeping this as is since user likes it)
    inactive: '#6b7280'   // Gray
  },
  
  // Facility level colors (Level 1 light to Level 6 dark)
  facilityLevel: {
    level_1: '#e0f2fe',    // Very light blue
    level_2: '#bae6fd',    // Light blue
    level_3: '#7dd3fc',    // Medium light blue
    level_4: '#38bdf8',    // Medium blue
    level_5: '#0ea5e9',    // Dark blue
    level_6: '#0284c7',    // Very dark blue
  },
  
  // Facility performance colors (using primary shades - darker = better performance)
  facilityPerformance: {
    low: '#38bdf8',        // Primary 400 (light blue)
    medium_low: '#0ea5e9', // Primary 500 (medium blue)
    medium: '#0284c7',     // Primary 600 (darker blue)
    medium_high: '#0369a1', // Primary 700 (even darker blue)
    high: '#075985',       // Primary 800 (darkest blue)
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
