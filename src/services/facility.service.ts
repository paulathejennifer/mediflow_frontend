export interface Facility {
  id: string
  name: string
  email: string
  facilityCode: string
  phone: string
  type: 'hospital' | 'clinic' | 'health_center' | 'dispensary'
  level: 1 | 2 | 3 | 4 | 5 | 6
  county: string
  address: string
  performance: number // 0-100
  joined: string
  status: 'active' | 'inactive'
  referrals: number
}


// Kenyan counties
export const counties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kisii', 'Thika', 'Kitale',
  'Garissa', 'Kakamega', 'Meru', 'Nyeri', 'Bungoma', 'Webuye', 'Naivasha', 'Lamu',
  'Machakos', 'Kericho', 'Embu', 'Kitui', 'Kilifi', 'Malindi', 'Voi', 'Isiolo',
  'Marsabit', 'Moyale', 'Wajir', 'Mandera', 'Lodwar', 'Kajiado', 'Namanga', 'Taveta'
]


// Generate facility code
const generateFacilityCode = (county: string, type: string): string => {
  const countyCode = county.substring(0, 3).toUpperCase()
  const typeCode = type === 'hospital' ? 'H' : type === 'clinic' ? 'C' : type === 'health_center' ? 'HC' : 'D'
  const randomNum = Math.floor(Math.random() * 9000) + 1000
  return `FAC-${countyCode}-${typeCode}-${randomNum}`
}


// Get performance badge variant based on score
const getPerformanceBadgeVariant = (score: number): string => {
  if (score >= 80) return 'performance_high'
  if (score >= 60) return 'performance_medium_high'
  if (score >= 40) return 'performance_medium'
  if (score >= 20) return 'performance_medium_low'
  return 'performance_low'
}


// Get level badge variant
const getLevelBadgeVariant = (level: number): string => {
  return `facility_level_${level}` as const
}


// Mock facility data
export const mockFacilitiesData: Facility[] = [
  {
    id: '1',
    name: 'Kenya Medical Center',
    email: 'info@kenyamedical.co.ke',
    facilityCode: generateFacilityCode('Nairobi', 'hospital'),
    phone: '+254-20-271-0000',
    type: 'hospital',
    level: 6,
    county: 'Nairobi',
    address: 'Mombasa Road, Nairobi',
    performance: 92,
    joined: '2020-01-15',
    status: 'active',
    referrals: 245
  },
  {
    id: '2',
    name: 'Coast General Hospital',
    email: 'contact@coastgeneral.go.ke',
    facilityCode: generateFacilityCode('Mombasa', 'hospital'),
    phone: '+254-41-231-0000',
    type: 'hospital',
    level: 5,
    county: 'Mombasa',
    address: 'Digo Road, Mombasa',
    performance: 78,
    joined: '2019-03-22',
    status: 'active',
    referrals: 189
  },
  {
    id: '3',
    name: 'Kisumu County Referral Hospital',
    email: 'info@kisumureferral.go.ke',
    facilityCode: generateFacilityCode('Kisumu', 'hospital'),
    phone: '+254-57-202-0000',
    type: 'hospital',
    level: 5,
    county: 'Kisumu',
    address: 'Kisumu-Kakamega Road, Kisumu',
    performance: 85,
    joined: '2018-07-10',
    status: 'active',
    referrals: 167
  },
  {
    id: '4',
    name: 'Nakuru Level 5 Hospital',
    email: 'admin@nakuruhospital.go.ke',
    facilityCode: generateFacilityCode('Nakuru', 'hospital'),
    phone: '+254-51-221-0000',
    type: 'hospital',
    level: 5,
    county: 'Nakuru',
    address: 'Nakuru-Eldoret Highway, Nakuru',
    performance: 73,
    joined: '2021-02-18',
    status: 'active',
    referrals: 134
  },
  {
    id: '5',
    name: 'Eldoret Referral Hospital',
    email: 'info@eldoretreferral.go.ke',
    facilityCode: generateFacilityCode('Eldoret', 'hospital'),
    phone: '+254-53-301-0000',
    type: 'hospital',
    level: 6,
    county: 'Eldoret',
    address: 'Eldoret-Kitale Road, Eldoret',
    performance: 88,
    joined: '2019-11-05',
    status: 'active',
    referrals: 198
  },
  {
    id: '6',
    name: 'Kisii Teaching and Referral Hospital',
    email: 'contact@kiisireferral.go.ke',
    facilityCode: generateFacilityCode('Kisii', 'hospital'),
    phone: '+254-58-301-0000',
    type: 'hospital',
    level: 5,
    county: 'Kisii',
    address: 'Kisii-Kisumu Road, Kisii',
    performance: 69,
    joined: '2020-09-12',
    status: 'active',
    referrals: 156
  },
  {
    id: '7',
    name: 'Thika Level 5 Hospital',
    email: 'admin@thikahospital.go.ke',
    facilityCode: generateFacilityCode('Thika', 'hospital'),
    phone: '+254-67-222-0000',
    type: 'hospital',
    level: 5,
    county: 'Thika',
    address: 'Garissa Road, Thika',
    performance: 76,
    joined: '2021-05-28',
    status: 'active',
    referrals: 143
  },
  {
    id: '8',
    name: 'Kitale County Referral Hospital',
    email: 'info@kitalereferal.go.ke',
    facilityCode: generateFacilityCode('Kitale', 'hospital'),
    phone: '+254-54-301-0000',
    type: 'hospital',
    level: 4,
    county: 'Kitale',
    address: 'Kitale-Eldoret Road, Kitale',
    performance: 62,
    joined: '2020-12-03',
    status: 'active',
    referrals: 98
  },
  {
    id: '9',
    name: 'Nairobi Women\'s Hospital',
    email: 'info@naiwobi.co.ke',
    facilityCode: generateFacilityCode('Nairobi', 'hospital'),
    phone: '+254-20-272-0000',
    type: 'hospital',
    level: 4,
    county: 'Nairobi',
    address: 'Hurlingham, Nairobi',
    performance: 84,
    joined: '2018-04-15',
    status: 'active',
    referrals: 178
  },
  {
    id: '10',
    name: 'Mombasa Hospital',
    email: 'contact@mombasahospital.co.ke',
    facilityCode: generateFacilityCode('Mombasa', 'hospital'),
    phone: '+254-41-232-0000',
    type: 'hospital',
    level: 4,
    county: 'Mombasa',
    address: 'Nyeri Avenue, Mombasa',
    performance: 71,
    joined: '2019-08-22',
    status: 'inactive',
    referrals: 87
  },
  {
    id: '11',
    name: 'Kakamega County Referral Hospital',
    email: 'admin@kakamegareferral.go.ke',
    facilityCode: generateFacilityCode('Kakamega', 'hospital'),
    phone: '+254-56-301-0000',
    type: 'hospital',
    level: 5,
    county: 'Kakamega',
    address: 'Kakamega-Kisumu Road, Kakamega',
    performance: 67,
    joined: '2020-10-17',
    status: 'active',
    referrals: 112
  },
  {
    id: '12',
    name: 'Meru Level 5 Hospital',
    email: 'info@meruhospital.go.ke',
    facilityCode: generateFacilityCode('Meru', 'hospital'),
    phone: '+254-64-301-0000',
    type: 'hospital',
    level: 4,
    county: 'Meru',
    address: 'Meru-Nanyuki Road, Meru',
    performance: 58,
    joined: '2021-03-08',
    status: 'active',
    referrals: 76
  },
  {
    id: '13',
    name: 'Nyeri County Referral Hospital',
    email: 'contact@nyerireferral.go.ke',
    facilityCode: generateFacilityCode('Nyeri', 'hospital'),
    phone: '+254-61-201-0000',
    type: 'hospital',
    level: 4,
    county: 'Nyeri',
    address: 'Nyeri-Nairobi Highway, Nyeri',
    performance: 65,
    joined: '2019-06-14',
    status: 'active',
    referrals: 89
  },
  {
    id: '14',
    name: 'Bungoma County Referral Hospital',
    email: 'info@bungomareferral.go.ke',
    facilityCode: generateFacilityCode('Bungoma', 'hospital'),
    phone: '+254-55-301-0000',
    type: 'hospital',
    level: 3,
    county: 'Bungoma',
    address: 'Bungoma-Webuye Road, Bungoma',
    performance: 52,
    joined: '2021-01-25',
    status: 'active',
    referrals: 54
  },
  {
    id: '15',
    name: 'UHC Dispensary',
    email: 'info@uhcdispensary.go.ke',
    facilityCode: generateFacilityCode('Nairobi', 'dispensary'),
    phone: '+254-20-273-0000',
    type: 'dispensary',
    level: 2,
    county: 'Nairobi',
    address: 'Kibra, Nairobi',
    performance: 45,
    joined: '2022-02-14',
    status: 'active',
    referrals: 23
  },
  {
    id: '16',
    name: 'Machakos Level 4 Hospital',
    email: 'admin@machakoshospital.go.ke',
    facilityCode: generateFacilityCode('Machakos', 'hospital'),
    phone: '+254-45-201-0000',
    type: 'hospital',
    level: 4,
    county: 'Machakos',
    address: 'Machakos-Nairobi Road, Machakos',
    performance: 59,
    joined: '2020-07-30',
    status: 'active',
    referrals: 68
  },
  {
    id: '17',
    name: 'Kericho District Hospital',
    email: 'contact@kerichohospital.go.ke',
    facilityCode: generateFacilityCode('Kericho', 'hospital'),
    phone: '+254-52-201-0000',
    type: 'hospital',
    level: 3,
    county: 'Kericho',
    address: 'Kericho-Nakuru Road, Kericho',
    performance: 48,
    joined: '2021-04-12',
    status: 'inactive',
    referrals: 31
  },
  {
    id: '18',
    name: 'Embu Level 5 Hospital',
    email: 'info@embuhospital.go.ke',
    facilityCode: generateFacilityCode('Embu', 'hospital'),
    phone: '+254-68-201-0000',
    type: 'hospital',
    level: 4,
    county: 'Embu',
    address: 'Embu-Meru Road, Embu',
    performance: 61,
    joined: '2020-11-19',
    status: 'active',
    referrals: 82
  },
  {
    id: '19',
    name: 'Kitui County Referral Hospital',
    email: 'admin@kituireferral.go.ke',
    facilityCode: generateFacilityCode('Kitui', 'hospital'),
    phone: '+254-44-201-0000',
    type: 'hospital',
    level: 3,
    county: 'Kitui',
    address: 'Kitui-Mwingi Road, Kitui',
    performance: 43,
    joined: '2021-06-07',
    status: 'inactive',
    referrals: 19
  },
  {
    id: '20',
    name: 'Kilifi County Hospital',
    email: 'contact@kilifihospital.go.ke',
    facilityCode: generateFacilityCode('Kilifi', 'hospital'),
    phone: '+254-41-522-0000',
    type: 'hospital',
    level: 4,
    county: 'Kilifi',
    address: 'Kilifi-Mombasa Road, Kilifi',
    performance: 56,
    joined: '2020-08-25',
    status: 'active',
    referrals: 74
  }
]


// Helper functions
export const getPerformanceVariant = getPerformanceBadgeVariant
export const getLevelVariant = getLevelBadgeVariant



