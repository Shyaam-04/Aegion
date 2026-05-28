import { User, Scan, Weight, Heart } from 'lucide-react'
import MedicineTagInput from './MedicineTagInput'
import { searchConditions } from '../../constants/conditions'

export default function PrescriptionForm({ formData, setFormData, onAnalyze, loading }) {
  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))
  const updateHistory = (field, value) => setFormData(prev => ({
    ...prev,
    patient_history: { ...prev.patient_history, [field]: value }
  }))

  const canSubmit =
    formData.doctor_id.trim() &&
    formData.medicines.length >= 1 &&
    !loading

  return (
    <aside className="w-full lg:w-[400px] lg:flex-shrink-0">
      <div className="card-glass gradient-border rounded-xl p-5 lg:sticky lg:top-[72px]">
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-txt-1">Prescription Analysis</h2>
          <p className="text-xs text-txt-3 mt-0.5">Enter patient and prescription details</p>
        </div>

        <div className="space-y-4">
          {/* Doctor ID */}
          <div>
            <label className="block text-xs font-medium text-txt-2 mb-1.5">Doctor ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-txt-3" />
              <input
                id="doctor-id-input"
                type="text"
                value={formData.doctor_id}
                onChange={(e) => update('doctor_id', e.target.value)}
                placeholder="e.g. DR001"
                className="input-base rounded-lg w-full h-[42px] pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          {/* Medicines — Star Component */}
          <MedicineTagInput
            value={formData.medicines}
            onChange={(v) => update('medicines', v)}
            allowCustom={true}
          />

          {/* Patient Details — Two Column */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-txt-2 mb-1.5">Age</label>
              <input
                id="age-input"
                type="number"
                value={formData.patient_history.age}
                onChange={(e) => updateHistory('age', parseInt(e.target.value) || 0)}
                placeholder="65"
                className="input-base rounded-lg w-full h-[42px] px-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-txt-2 mb-1.5">Weight (kg)</label>
              <input
                id="weight-input"
                type="number"
                value={formData.patient_history.weight}
                onChange={(e) => updateHistory('weight', parseInt(e.target.value) || 0)}
                placeholder="72"
                className="input-base rounded-lg w-full h-[42px] px-3 text-sm"
              />
            </div>
          </div>

          {/* Known Allergies */}
          <MedicineTagInput
            label="Known Allergies"
            value={formData.patient_history.known_allergies}
            onChange={(v) => updateHistory('known_allergies', v)}
            placeholder="Search or add allergy…"
            allowCustom={true}
          />

          {/* Current Medications */}
          <MedicineTagInput
            label="Current Medications"
            value={formData.patient_history.current_medications}
            onChange={(v) => updateHistory('current_medications', v)}
            placeholder="Search medications…"
            allowCustom={true}
          />

          {/* Conditions */}
          <MedicineTagInput
            label="Conditions"
            value={formData.patient_history.conditions}
            onChange={(v) => updateHistory('conditions', v)}
            placeholder="Search conditions…"
            allowCustom={true}
            searchFn={searchConditions}
          />

          {/* Submit */}
          <button
            id="analyze-btn"
            onClick={onAnalyze}
            disabled={!canSubmit}
            className="btn-primary w-full h-11 rounded-lg text-sm flex items-center justify-center gap-2 mt-2"
          >
            <Scan className="w-4 h-4" />
            {loading ? 'Analyzing…' : 'Analyze Prescription'}
          </button>
        </div>
      </div>
    </aside>
  )
}
