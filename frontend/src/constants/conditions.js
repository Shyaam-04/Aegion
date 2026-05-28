// Common medical conditions for autocomplete — curated for clinical relevance
export const CONDITIONS = [
  // Cardiovascular
  'Hypertension', 'Heart Failure', 'Coronary Artery Disease', 'Atrial Fibrillation', 'Angina',
  'Myocardial Infarction', 'Peripheral Artery Disease', 'Deep Vein Thrombosis', 'Pulmonary Embolism',
  'Cardiomyopathy', 'Arrhythmia', 'Bradycardia', 'Tachycardia',
  // Metabolic & Endocrine
  'Type 1 Diabetes', 'Type 2 Diabetes', 'Hypothyroidism', 'Hyperthyroidism', 'Obesity',
  'Hyperlipidemia', 'Hyperuricemia', 'Metabolic Syndrome', 'Cushing Syndrome', 'Addison Disease',
  // Respiratory
  'Asthma', 'COPD', 'Pneumonia', 'Pulmonary Fibrosis', 'Sleep Apnea', 'Bronchitis',
  'Tuberculosis', 'Pleural Effusion', 'Lung Cancer', 'Emphysema',
  // Renal & Urological
  'Chronic Kidney Disease', 'Acute Kidney Injury', 'Urinary Tract Infection', 'Nephrolithiasis',
  'Nephrotic Syndrome', 'Benign Prostatic Hyperplasia', 'Glomerulonephritis',
  // Gastrointestinal
  'GERD', 'Peptic Ulcer Disease', 'Crohn Disease', 'Ulcerative Colitis', 'Irritable Bowel Syndrome',
  'Cirrhosis', 'Hepatitis B', 'Hepatitis C', 'Pancreatitis', 'Celiac Disease', 'Cholecystitis',
  // Neurological
  'Epilepsy', 'Migraine', 'Stroke', 'Parkinson Disease', 'Alzheimer Disease', 'Multiple Sclerosis',
  'Peripheral Neuropathy', 'Dementia', 'Transient Ischemic Attack',
  // Psychiatric
  'Depression', 'Anxiety Disorder', 'Bipolar Disorder', 'Schizophrenia', 'PTSD', 'OCD', 'ADHD',
  'Insomnia', 'Panic Disorder',
  // Musculoskeletal
  'Rheumatoid Arthritis', 'Osteoarthritis', 'Osteoporosis', 'Gout', 'Fibromyalgia',
  'Ankylosing Spondylitis', 'Systemic Lupus Erythematosus',
  // Haematological
  'Anaemia', 'Iron Deficiency Anaemia', 'Sickle Cell Disease', 'Thalassemia', 'Thrombocytopenia',
  'Leukaemia', 'Lymphoma',
  // Dermatological
  'Psoriasis', 'Eczema', 'Acne', 'Rosacea', 'Urticaria',
  // Oncological
  'Breast Cancer', 'Prostate Cancer', 'Colorectal Cancer', 'Cervical Cancer', 'Liver Cancer',
  // Infectious
  'HIV / AIDS', 'Malaria', 'Dengue Fever', 'Typhoid', 'COVID-19',
]

export function searchConditions(query, exclude = []) {
  if (!query || query.length < 1) return []
  const q = query.toLowerCase()
  return CONDITIONS
    .filter(c => !exclude.includes(c))
    .filter(c => c.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(q)
      const bStarts = b.toLowerCase().startsWith(q)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return a.localeCompare(b)
    })
    .slice(0, 8)
}
