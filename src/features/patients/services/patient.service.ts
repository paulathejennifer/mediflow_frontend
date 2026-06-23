import apiClient from '@/lib/axios'

export interface Patient {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  phone: string
  email: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_history: string
  allergies: string
  medications: string
  chronic_conditions: string
  created_at: string
  updated_at: string
  identifiers?: PatientIdentifier[]
}

export interface PatientIdentifier {
  id: number
  mrn: string
  facility_id: number
  facility_name: string
  facility_code: string
  created_at: string
}

export interface CreatePatientRequest {
  first_name: string
  last_name: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  phone: string
  email: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_history?: string
  allergies?: string
  medications?: string
  chronic_conditions?: string
}

export interface UpdatePatientRequest {
  first_name?: string
  last_name?: string
  phone?: string
  email?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_history?: string
  allergies?: string
  medications?: string
  chronic_conditions?: string
}
export interface DuplicateMatch {
  patient: Patient
  similarity_score: number
  matched_fields: string[]
}

export interface DuplicateCheckResponse {
  duplicate_detected: boolean
  highest_score: number
  matches: DuplicateMatch[]
}

export const patientService = {
  createPatient: async (data: CreatePatientRequest & { force_save?: boolean }): Promise<Patient> => {
    // For super-admin or when facility_id is not provided, we can let backend handle it
    // or pass current user's facility
    const response = await apiClient.post('/patients', data);
    return response.data;
  },

  getPatients: async (params?: {
    skip?: number
    limit?: number
    search?: string
  }): Promise<Patient[]> => {
    const response = await apiClient.get('/patients', { params })
    return response.data
  },

  getPatientById: async (patientId: number): Promise<Patient> => {
    const response = await apiClient.get(`/patients/${patientId}`)
    return response.data
  },

  getPatientByMRN: async (mrn: string): Promise<Patient> => {
    const response = await apiClient.get(`/patients/mrn/${mrn}`)
    return response.data
  },

  updatePatient: async (
    patientId: number,
    data: UpdatePatientRequest
  ): Promise<Patient> => {
    const response = await apiClient.put(`/patients/${patientId}`, data)
    return response.data
  },

  checkDuplicate: async (params: {
    first_name?: string
    last_name?: string
    date_of_birth?: string
    phone?: string
    email?: string
  }): Promise<DuplicateCheckResponse> => {
    const response = await apiClient.get('/patients/check-duplicates', { params })
    return response.data
  },
  preCheckDuplicate: async (params: {
  first_name?: string
  last_name?: string
  date_of_birth?: string
  phone?: string
  email?: string
}): Promise<Array<{
  existing_patient_id: number
  existing_patient_name: string
  combined_score: number
  fuzzy_ratio: number
  tfidf_similarity: number
}>> => {
  const response = await apiClient.post('/duplicates/pre-check', params)
  return response.data
},

}
