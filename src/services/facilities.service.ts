export interface Facility {
  id: number
  name: string
  code: string
  level: number
  county: string
  performance: number
}

// Mock Kenyan facilities with realistic performance scores (100 facilities)
export const facilities: Facility[] = [
  { id: 1, name: 'Kenyatta National Hospital', code: 'KNH', level: 6, county: 'Nairobi', performance: 92 },
  { id: 2, name: 'Moi Teaching and Referral Hospital', code: 'MTRH', level: 6, county: 'Uasin Gishu', performance: 88 },
  { id: 3, name: 'Nakuru Level 5 Hospital', code: 'NLRH', level: 5, county: 'Nakuru', performance: 81 },
  { id: 4, name: 'Kisumu County Hospital', code: 'KCH', level: 5, county: 'Kisumu', performance: 76 },
  { id: 5, name: 'Machakos Level 5 Hospital', code: 'MLRH', level: 5, county: 'Machakos', performance: 73 },
  { id: 6, name: 'Nyeri County Referral Hospital', code: 'NCRH', level: 5, county: 'Nyeri', performance: 79 },
  { id: 7, name: 'Kakamega County Hospital', code: 'KCH', level: 5, county: 'Kakamega', performance: 70 },
  { id: 8, name: 'Garissa County Hospital', code: 'GCH', level: 4, county: 'Garissa', performance: 61 },
  { id: 9, name: 'Kitale County Hospital', code: 'KCH', level: 4, county: 'Trans Nzoia', performance: 67 },
  { id: 10, name: 'Malindi Sub-County Hospital', code: 'MSCH', level: 4, county: 'Kilifi', performance: 64 },
  { id: 11, name: 'Eldoret Referral Hospital', code: 'ERH', level: 5, county: 'Uasin Gishu', performance: 78 },
  { id: 12, name: 'Mombasa County Hospital', code: 'MCH', level: 5, county: 'Mombasa', performance: 74 },
  { id: 13, name: 'Thika Level 5 Hospital', code: 'TLRH', level: 5, county: 'Kiambu', performance: 77 },
  { id: 14, name: 'Meru County Referral Hospital', code: 'MCRH', level: 5, county: 'Meru', performance: 71 },
  { id: 15, name: 'Kericho County Hospital', code: 'KCH', level: 4, county: 'Kericho', performance: 69 },
  { id: 16, name: 'Bungoma County Hospital', code: 'BCH', level: 4, county: 'Bungoma', performance: 65 },
  { id: 17, name: 'Kisii County Hospital', code: 'KCH', level: 4, county: 'Kisii', performance: 72 },
  { id: 18, name: 'Busia County Hospital', code: 'BCH', level: 4, county: 'Busia', performance: 63 },
  { id: 19, name: 'Vihiga County Hospital', code: 'VCH', level: 4, county: 'Vihiga', performance: 68 },
  { id: 20, name: 'Turkana County Hospital', code: 'TCH', level: 3, county: 'Turkana', performance: 58 },
  { id: 21, name: 'West Pokot County Hospital', code: 'WPCH', level: 3, county: 'West Pokot', performance: 55 },
  { id: 22, name: 'Samburu County Hospital', code: 'SCH', level: 3, county: 'Samburu', performance: 52 },
  { id: 23, name: 'Marsabit County Hospital', code: 'MCH', level: 3, county: 'Marsabit', performance: 49 },
  { id: 24, name: 'Isiolo County Hospital', code: 'ICH', level: 3, county: 'Isiolo', performance: 54 },
  { id: 25, name: 'Mandera County Hospital', code: 'MCH', level: 3, county: 'Mandera', performance: 45 },
  { id: 26, name: 'Wajir County Hospital', code: 'WCH', level: 3, county: 'Wajir', performance: 47 },
  { id: 27, name: 'Lamu County Hospital', code: 'LCH', level: 3, county: 'Lamu', performance: 51 },
  { id: 28, name: 'Tana River County Hospital', code: 'TRCH', level: 3, county: 'Tana River', performance: 48 },
  { id: 29, name: 'Taita Taveta County Hospital', code: 'TTCH', level: 4, county: 'Taita Taveta', performance: 66 },
  { id: 30, name: 'Kwale County Hospital', code: 'KCH', level: 4, county: 'Kwale', performance: 62 },
  { id: 31, name: 'Kilifi County Hospital', code: 'KCH', level: 4, county: 'Kilifi', performance: 75 },
  { id: 32, name: 'Migori County Hospital', code: 'MCH', level: 4, county: 'Migori', performance: 70 },
  { id: 33, name: 'Homa Bay County Hospital', code: 'HBCH', level: 4, county: 'Homa Bay', performance: 67 },
  { id: 34, name: 'Siaya County Hospital', code: 'SCH', level: 4, county: 'Siaya', performance: 64 },
  { id: 35, name: 'Bondo Sub-County Hospital', code: 'BSCH', level: 3, county: 'Siaya', performance: 59 },
  { id: 36, name: 'Ugenya Sub-County Hospital', code: 'USCH', level: 3, county: 'Siaya', performance: 56 },
  { id: 37, name: 'Rongo Sub-County Hospital', code: 'RSCH', level: 3, county: 'Migori', performance: 53 },
  { id: 38, name: 'Awendo Sub-County Hospital', code: 'ASCH', level: 3, county: 'Migori', performance: 50 },
  { id: 39, name: 'Nyamira County Hospital', code: 'NCH', level: 4, county: 'Nyamira', performance: 71 },
  { id: 40, name: 'Nyamira Level 4 Hospital', code: 'NLH', level: 4, county: 'Nyamira', performance: 69 },
  { id: 41, name: 'Naivasha Level 4 Hospital', code: 'NLH', level: 4, county: 'Nakuru', performance: 74 },
  { id: 42, name: 'Gilgil Sub-County Hospital', code: 'GSCH', level: 3, county: 'Nakuru', performance: 60 },
  { id: 43, name: 'Molo Sub-County Hospital', code: 'MSCH', level: 3, county: 'Nakuru', performance: 57 },
  { id: 44, name: 'Narok County Hospital', code: 'NCH', level: 4, county: 'Narok', performance: 65 },
  { id: 45, name: 'Kajiado County Hospital', code: 'KCH', level: 4, county: 'Kajiado', performance: 68 },
  { id: 46, name: 'Embu County Hospital', code: 'ECH', level: 4, county: 'Embu', performance: 72 },
  { id: 47, name: 'Chuka County Hospital', code: 'CCH', level: 3, county: 'Tharaka Nithi', performance: 59 },
  { id: 48, name: 'Chogoria Hospital', code: 'CH', level: 3, county: 'Tharaka Nithi', performance: 61 },
  { id: 49, name: 'Kiritiri Sub-County Hospital', code: 'KSCH', level: 3, county: 'Embu', performance: 54 },
  { id: 50, name: 'Runyenjes Sub-County Hospital', code: 'RSCH', level: 3, county: 'Embu', performance: 52 },
  { id: 51, name: 'Nairobi South Hospital', code: 'NSH', level: 4, county: 'Nairobi', performance: 83 },
  { id: 52, name: 'Mbagathi County Hospital', code: 'MCH', level: 4, county: 'Nairobi', performance: 80 },
  { id: 53, name: 'Kenyatta University Hospital', code: 'KUH', level: 5, county: 'Nairobi', performance: 85 },
  { id: 54, name: 'Karen Hospital', code: 'KH', level: 4, county: 'Nairobi', performance: 78 },
  { id: 55, name: 'Nairobi West Hospital', code: 'NWH', level: 4, county: 'Nairobi', performance: 75 },
  { id: 56, name: 'Eldoret Hospital', code: 'EH', level: 4, county: 'Uasin Gishu', performance: 71 },
  { id: 57, name: 'Moiben Sub-County Hospital', code: 'MSCH', level: 3, county: 'Uasin Gishu', performance: 58 },
  { id: 58, name: 'Burnt Forest Hospital', code: 'BFH', level: 3, county: 'Uasin Gishu', performance: 54 },
  { id: 59, name: 'Nakuru War Memorial Hospital', code: 'NWMH', level: 4, county: 'Nakuru', performance: 77 },
  { id: 60, name: 'Nakuru County Referral Hospital', code: 'NCRH', level: 5, county: 'Nakuru', performance: 82 },
  { id: 61, name: 'Molo Sub-County Hospital', code: 'MSCH', level: 3, county: 'Nakuru', performance: 60 },
  { id: 62, name: 'Gilgil Sub-County Hospital', code: 'GSCH', level: 3, county: 'Nakuru', performance: 56 },
  { id: 63, name: 'Naivasha Sub-County Hospital', code: 'NSCH', level: 3, county: 'Nakuru', performance: 63 },
  { id: 64, name: 'Kisumu County Referral Hospital', code: 'KCRH', level: 5, county: 'Kisumu', performance: 79 },
  { id: 65, name: 'Jaramogi Oginga Odinga Hospital', code: 'JOOH', level: 5, county: 'Kisumu', performance: 76 },
  { id: 66, name: 'Kisumu East Hospital', code: 'KEH', level: 4, county: 'Kisumu', performance: 72 },
  { id: 67, name: 'Mombasa County Referral Hospital', code: 'MCRH', level: 5, county: 'Mombasa', performance: 78 },
  { id: 68, name: 'Coast Provincial Hospital', code: 'CPH', level: 5, county: 'Mombasa', performance: 74 },
  { id: 69, name: 'Likoni Sub-County Hospital', code: 'LSCH', level: 3, county: 'Mombasa', performance: 61 },
  { id: 70, name: 'Mtwapa Sub-County Hospital', code: 'MSCH', level: 3, county: 'Mombasa', performance: 58 },
  { id: 71, name: 'Kiambu County Hospital', code: 'KCH', level: 4, county: 'Kiambu', performance: 73 },
  { id: 72, name: 'Thika Level 5 Hospital', code: 'TL5H', level: 5, county: 'Kiambu', performance: 80 },
  { id: 73, name: 'Ruiru Sub-County Hospital', code: 'RSCH', level: 3, county: 'Kiambu', performance: 65 },
  { id: 74, name: 'Kikuyu Mission Hospital', code: 'KMH', level: 4, county: 'Kiambu', performance: 71 },
  { id: 75, name: 'Meru Level 5 Hospital', code: 'ML5H', level: 5, county: 'Meru', performance: 77 },
  { id: 76, name: 'Meru County Referral Hospital', code: 'MCRH', level: 5, county: 'Meru', performance: 75 },
  { id: 77, name: 'Nanyuki Teaching and Referral Hospital', code: 'NTRH', level: 5, county: 'Laikipia', performance: 81 },
  { id: 78, name: 'Nanyuki County Hospital', code: 'NCH', level: 4, county: 'Laikipia', performance: 74 },
  { id: 79, name: 'Nyahururu County Hospital', code: 'NCH', level: 4, county: 'Laikipia', performance: 69 },
  { id: 80, name: 'Eldoret County Referral Hospital', code: 'ECRH', level: 5, county: 'Uasin Gishu', performance: 84 },
  { id: 81, name: 'Iten County Hospital', code: 'ICH', level: 4, county: 'Elgeyo Marakwet', performance: 66 },
  { id: 82, name: 'Kapsowar County Hospital', code: 'KCH', level: 3, county: 'Elgeyo Marakwet', performance: 59 },
  { id: 83, name: 'Kericho County Referral Hospital', code: 'KCRH', level: 5, county: 'Kericho', performance: 76 },
  { id: 84, name: 'Bomet County Hospital', code: 'BCH', level: 4, county: 'Bomet', performance: 68 },
  { id: 85, name: 'Tenwek Hospital', code: 'TH', level: 5, county: 'Bomet', performance: 82 },
  { id: 86, name: 'Litein County Hospital', code: 'LCH', level: 3, county: 'Bomet', performance: 55 },
  { id: 87, name: 'Kakamega County Referral Hospital', code: 'KCRH', level: 5, county: 'Kakamega', performance: 78 },
  { id: 88, name: 'Webuye County Hospital', code: 'WCH', level: 4, county: 'Bungoma', performance: 67 },
  { id: 89, name: 'Kimilili County Hospital', code: 'KCH', level: 3, county: 'Bungoma', performance: 60 },
  { id: 90, name: 'Busia County Referral Hospital', code: 'BCRH', level: 4, county: 'Busia', performance: 70 },
  { id: 91, name: 'Port Victoria Sub-County Hospital', code: 'PVSCH', level: 3, county: 'Busia', performance: 54 },
  { id: 92, name: 'Siaya County Referral Hospital', code: 'SCRH', level: 5, county: 'Siaya', performance: 75 },
  { id: 93, name: 'Yala Sub-County Hospital', code: 'YSCH', level: 3, county: 'Siaya', performance: 57 },
  { id: 94, name: 'Ukwala Sub-County Hospital', code: 'USCH', level: 3, county: 'Siaya', performance: 52 },
  { id: 95, name: 'Homa Bay County Referral Hospital', code: 'HBCRH', level: 5, county: 'Homa Bay', performance: 73 },
  { id: 96, name: 'Migori County Referral Hospital', code: 'MCRH', level: 5, county: 'Migori', performance: 71 },
  { id: 97, name: 'Rongo County Hospital', code: 'RCH', level: 4, county: 'Migori', performance: 66 },
  { id: 98, name: 'Isebania Sub-County Hospital', code: 'ISCH', level: 3, county: 'Migori', performance: 48 },
  { id: 99, name: 'Sori Sub-County Hospital', code: 'SSCH', level: 3, county: 'Migori', performance: 51 },
  { id: 100, name: 'Awendo County Hospital', code: 'ACH', level: 4, county: 'Migori', performance: 64 }
]

// Function to get heat color based on performance score
export function getHeatColor(performance: number): string {
  const t = Math.max(0, Math.min(1, performance / 100));

  // Premium dark → electric blue gradient
  const hue = 187;                         // deep blue
  const saturation = 35 + t * 55;          // muted → rich
  const lightness = 10 + t * 50;           // near-black → visible glow

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}