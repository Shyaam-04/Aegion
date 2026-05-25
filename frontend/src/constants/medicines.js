// Common prescribed drugs for autocomplete — curated for clinical relevance
export const MEDICINES = [
  // Anticoagulants & Antiplatelets
  'Warfarin', 'Heparin', 'Enoxaparin', 'Aspirin', 'Clopidogrel', 'Rivaroxaban', 'Apixaban', 'Dabigatran', 'Ticagrelor',
  // Analgesics & NSAIDs
  'Ibuprofen', 'Naproxen', 'Diclofenac', 'Acetaminophen', 'Celecoxib', 'Ketorolac', 'Tramadol', 'Morphine', 'Codeine', 'Oxycodone', 'Fentanyl',
  // Antibiotics
  'Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Levofloxacin', 'Doxycycline', 'Metronidazole', 'Clindamycin', 'Trimethoprim', 'Cephalexin', 'Penicillin', 'Erythromycin', 'Vancomycin', 'Gentamicin',
  // Cardiovascular
  'Lisinopril', 'Enalapril', 'Losartan', 'Valsartan', 'Amlodipine', 'Metoprolol', 'Atenolol', 'Carvedilol', 'Propranolol', 'Diltiazem', 'Verapamil', 'Hydralazine', 'Furosemide', 'Hydrochlorothiazide', 'Spironolactone',
  // Statins & Lipid
  'Atorvastatin', 'Rosuvastatin', 'Simvastatin', 'Pravastatin', 'Lovastatin', 'Fenofibrate', 'Ezetimibe',
  // Diabetes
  'Metformin', 'Glipizide', 'Glyburide', 'Sitagliptin', 'Empagliflozin', 'Dapagliflozin', 'Pioglitazone', 'Insulin Glargine', 'Insulin Lispro', 'Liraglutide', 'Semaglutide',
  // GI
  'Omeprazole', 'Pantoprazole', 'Esomeprazole', 'Ranitidine', 'Famotidine', 'Ondansetron', 'Metoclopramide', 'Sucralfate',
  // Respiratory
  'Albuterol', 'Fluticasone', 'Montelukast', 'Tiotropium', 'Budesonide', 'Prednisone', 'Dexamethasone',
  // Psychiatric
  'Sertraline', 'Fluoxetine', 'Escitalopram', 'Citalopram', 'Venlafaxine', 'Duloxetine', 'Bupropion', 'Mirtazapine', 'Trazodone', 'Alprazolam', 'Lorazepam', 'Diazepam', 'Clonazepam', 'Lithium', 'Quetiapine', 'Olanzapine', 'Aripiprazole', 'Risperidone', 'Haloperidol',
  // Anticonvulsants
  'Gabapentin', 'Pregabalin', 'Carbamazepine', 'Valproic Acid', 'Levetiracetam', 'Phenytoin', 'Lamotrigine', 'Topiramate',
  // Thyroid
  'Levothyroxine', 'Methimazole', 'Propylthiouracil',
  // Antihistamines
  'Cetirizine', 'Loratadine', 'Diphenhydramine', 'Fexofenadine', 'Hydroxyzine',
  // Immunosuppressants
  'Cyclosporine', 'Tacrolimus', 'Mycophenolate', 'Azathioprine', 'Methotrexate',
  // Others
  'Sildenafil', 'Tamsulosin', 'Finasteride', 'Colchicine', 'Allopurinol',
]

export function searchMedicines(query, exclude = []) {
  if (!query || query.length < 1) return []
  const q = query.toLowerCase()
  return MEDICINES
    .filter(m => !exclude.includes(m))
    .filter(m => m.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(q)
      const bStarts = b.toLowerCase().startsWith(q)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return a.localeCompare(b)
    })
    .slice(0, 8)
}
