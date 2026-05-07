// Staff service with mock data

export interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role: 'super_admin' | 'facility_admin' | 'clinician'
  facility: string
  facilityCode: string
  status: 'active' | 'inactive'
  joinDate: string
  lastLogin: string
  referrals: number
  profileImage?: string
}

export const mockStaffData: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@mediflow.com',
    phone: '+254 712 345 678',
    role: 'super_admin',
    facility: 'MediFlow Headquarters',
    facilityCode: 'MF-001',
    status: 'active',
    joinDate: '2023-01-15',
    lastLogin: '2024-05-03',
    referrals: 245,
    profileImage: '/images/staff/sarah.jpg'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@mediflow.com',
    phone: '+254 723 456 789',
    role: 'facility_admin',
    facility: 'Nairobi General Hospital',
    facilityCode: 'NGH-002',
    status: 'active',
    joinDate: '2023-03-20',
    lastLogin: '2024-05-02',
    referrals: 189,
    profileImage: '/images/staff/michael.jpg'
  },
  {
    id: '3',
    name: 'Dr. Emily Wilson',
    email: 'emily.wilson@mediflow.com',
    phone: '+254 734 567 890',
    role: 'clinician',
    facility: 'Mombasa Medical Center',
    facilityCode: 'MMC-003',
    status: 'active',
    joinDate: '2023-06-10',
    lastLogin: '2024-05-03',
    referrals: 156,
    profileImage: '/images/staff/emily.jpg'
  },
  {
    id: '4',
    name: 'Dr. James Brown',
    email: 'james.brown@mediflow.com',
    phone: '+254 745 678 901',
    role: 'clinician',
    facility: 'Kisumu District Hospital',
    facilityCode: 'KDH-004',
    status: 'inactive',
    joinDate: '2023-02-28',
    lastLogin: '2024-04-28',
    referrals: 98,
    profileImage: '/images/staff/james.jpg'
  },
  {
    id: '5',
    name: 'Dr. Grace Akoth',
    email: 'grace.akoth@mediflow.com',
    phone: '+254 756 789 012',
    role: 'facility_admin',
    facility: 'Nakuru Regional Hospital',
    facilityCode: 'NRH-005',
    status: 'active',
    joinDate: '2023-04-15',
    lastLogin: '2024-05-01',
    referrals: 167,
    profileImage: '/images/staff/grace.jpg'
  },
  {
    id: '6',
    name: 'Dr. David Ochieng',
    email: 'david.ochieng@mediflow.com',
    phone: '+254 767 890 123',
    role: 'clinician',
    facility: 'Eldoret Medical Center',
    facilityCode: 'EMC-006',
    status: 'active',
    joinDate: '2023-07-22',
    lastLogin: '2024-05-02',
    referrals: 134,
    profileImage: '/images/staff/david.jpg'
  }
]

export const staffService = {
  getStaff: () => Promise.resolve(mockStaffData),
  getStaffById: (id: string) => Promise.resolve(mockStaffData.find(staff => staff.id === id)),
  getStaffByRole: (role: string) => Promise.resolve(mockStaffData.filter(staff => staff.role === role)),
  getStaffByStatus: (status: string) => Promise.resolve(mockStaffData.filter(staff => staff.status === status))
}
