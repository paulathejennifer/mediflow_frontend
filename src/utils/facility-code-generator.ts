// Facility Code Auto-Generator
// Based on the requirements provided

export function generateFacilityCode(facilityName: string, facilityType: string): string {
  // Extract first letters from facility name
  const nameWords = facilityName.toUpperCase().split(' ').filter(word => word.length > 0)
  let code = ''
  
  // Take first letter of each word (max 4 chars)
  for (let i = 0; i < Math.min(4, nameWords.length); i++) {
    code += nameWords[i][0]
  }
  
  // Add type suffix if needed
  const typeSuffix = getTypeSuffix(facilityType)
  if (code.length < 3) {
    code += typeSuffix
  }
  
  // Ensure code is at least 3 characters and max 4
  if (code.length < 3) {
    // Pad with additional letters if needed
    const remainingChars = 3 - code.length
    for (let i = 0; i < remainingChars && i < nameWords.length; i++) {
      if (nameWords[i].length > 1) {
        code += nameWords[i][1]
      }
    }
  }
  
  return code.substring(0, 4).toUpperCase()
}

function getTypeSuffix(type: string): string {
  const suffixes: Record<string, string> = {
    'hospital': 'H',
    'clinic': 'C', 
    'health_center': 'HC',
    'dispensary': 'D',
    'referral_center': 'RC'
  }
  return suffixes[type] || ''
}

// Validation function for facility code
export function validateFacilityCode(code: string): boolean {
  // Must be 3-4 characters, uppercase
  return /^[A-Z]{3,4}$/.test(code)
}

// Examples for testing
export const facilityCodeExamples = [
  { name: "Kenyatta National Hospital", type: "hospital", expected: "KNH" },
  { name: "Moi Teaching and Referral Hospital", type: "hospital", expected: "MTRH" },
  { name: "Nakuru Level 5 Hospital", type: "hospital", expected: "NL5H" },
  { name: "Kisumu County Hospital", type: "hospital", expected: "KCH" },
  { name: "Nairobi Clinic", type: "clinic", expected: "NC" },
  { name: "Mombasa Health Center", type: "health_center", expected: "MHC" }
]
