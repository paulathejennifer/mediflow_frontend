export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: 'male' | 'female' | 'other'
  bloodType: string
  location: string
  registrationDate: string
  lastVisit: string
  status: 'active' | 'inactive'
  primaryCondition: string
  mrn: string // Medical Record Number
  referrals: number
}

// Generate MRN based on facility
const generateMRN = (facility: string, index: number): string => {
  const year = new Date().getFullYear()
  const paddedIndex = String(index).padStart(4, '0')
  const checkDigit = Math.floor(Math.random() * 10)
  
  switch (facility) {
    case 'KNH':
      return `KNH-${year}-${paddedIndex}-${checkDigit}`
    case 'MTRH':
      return `MTRH-${year}-${paddedIndex}-${checkDigit}`
    default:
      return `HOSP-${year}-${paddedIndex}-${checkDigit}`
  }
}

// Mock patient data
export const mockPatientsData: Patient[] = [
  {
    id: '1',
    name: 'John Kamau',
    email: 'john.kamau@email.com',
    phone: '+254 712 345 678',
    age: 45,
    gender: 'male',
    bloodType: 'O+',
    location: 'Nairobi, Kenya',
    registrationDate: '2023-01-15',
    lastVisit: '2024-05-01',
    status: 'active',
    primaryCondition: 'Hypertension',
    mrn: generateMRN('KNH', 1),
    referrals: 3
  },
  {
    id: '2',
    name: 'Mary Wanjiku',
    email: 'mary.wanjiku@email.com',
    phone: '+254 723 456 789',
    age: 32,
    gender: 'female',
    bloodType: 'A+',
    location: 'Mombasa, Kenya',
    registrationDate: '2023-02-20',
    lastVisit: '2024-04-28',
    status: 'active',
    primaryCondition: 'Diabetes Type 2',
    mrn: generateMRN('MTRH', 1),
    referrals: 2
  },
  {
    id: '3',
    name: 'James Otieno',
    email: 'james.otieno@email.com',
    phone: '+254 734 567 890',
    age: 28,
    gender: 'male',
    bloodType: 'B+',
    location: 'Kisumu, Kenya',
    registrationDate: '2023-03-10',
    lastVisit: '2024-05-02',
    status: 'active',
    primaryCondition: 'Asthma',
    mrn: generateMRN('KNH', 2),
    referrals: 1
  },
  {
    id: '4',
    name: 'Grace Achieng',
    email: 'grace.achieng@email.com',
    phone: '+254 745 678 901',
    age: 67,
    gender: 'female',
    bloodType: 'O-',
    location: 'Nakuru, Kenya',
    registrationDate: '2023-04-05',
    lastVisit: '2024-04-15',
    status: 'inactive',
    primaryCondition: 'Arthritis',
    mrn: generateMRN('MTRH', 2),
    referrals: 0
  },
  {
    id: '5',
    name: 'David Kimani',
    email: 'david.kimani@email.com',
    phone: '+254 756 789 012',
    age: 15,
    gender: 'male',
    bloodType: 'AB+',
    location: 'Eldoret, Kenya',
    registrationDate: '2023-05-12',
    lastVisit: '2024-05-03',
    status: 'active',
    primaryCondition: 'Allergies',
    mrn: generateMRN('KNH', 3),
    referrals: 4
  },
  {
    id: '6',
    name: 'Sarah Njeri',
    email: 'sarah.njeri@email.com',
    phone: '+254 767 890 123',
    age: 52,
    gender: 'female',
    bloodType: 'A-',
    location: 'Thika, Kenya',
    registrationDate: '2023-06-18',
    lastVisit: '2024-04-30',
    status: 'active',
    primaryCondition: 'Hypertension',
    mrn: generateMRN('MTRH', 3),
    referrals: 2
  },
  {
    id: '7',
    name: 'Peter Mutua',
    email: 'peter.mutua@email.com',
    phone: '+254 778 901 234',
    age: 38,
    gender: 'male',
    bloodType: 'B-',
    location: 'Kericho, Kenya',
    registrationDate: '2023-07-22',
    lastVisit: '2024-05-01',
    status: 'active',
    primaryCondition: 'Migraine',
    mrn: generateMRN('KNH', 4),
    referrals: 1
  },
  {
    id: '8',
    name: 'Esther Wanjala',
    email: 'esther.wanjala@email.com',
    phone: '+254 789 012 345',
    age: 71,
    gender: 'female',
    bloodType: 'O+',
    location: 'Nairobi, Kenya',
    registrationDate: '2023-08-30',
    lastVisit: '2024-04-20',
    status: 'inactive',
    primaryCondition: 'Diabetes Type 1',
    mrn: generateMRN('MTRH', 4),
    referrals: 0
  }
]
