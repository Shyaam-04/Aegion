import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown, Search } from 'lucide-react'
import { searchMedicines } from '../../constants/medicines'

export default function MedicineTagInput({
  value = [],
  onChange,
  label = 'Medicines to Prescribe',
  placeholder = 'Search medicines…',
  allowCustom = false
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [highlightIdx, setHighlightIdx] = useState(0)
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (query.length >= 1) {
      const results = searchMedicines(query, value)
      setSuggestions(results)
      setHighlightIdx(0)
      setOpen(results.length > 0)
    } else {
      setSuggestions([])
      setOpen(false)
    }
  }, [query, value])

  const addMedicine = (med) => {
    if (!value.includes(med)) {
      onChange([...value, med])
    }
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  const removeMedicine = (med) => {
    onChange(value.filter(m => m !== med))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && suggestions[highlightIdx]) {
        addMedicine(suggestions[highlightIdx])
      } else if (allowCustom && query.trim() !== '') {
        addMedicine(query.trim())
      }
    } else if (e.key === 'Backspace' && query === '' && value.length > 0) {
      removeMedicine(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Scroll highlighted item into view
  useEffect(() => {
    if (dropdownRef.current && open) {
      const item = dropdownRef.current.children[highlightIdx]
      if (item) item.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIdx, open])

  const highlightMatch = (text, q) => {
    if (!q) return text
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-accent font-semibold">{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    )
  }

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-txt-2 mb-1.5">
        {label}
      </label>

      <div
        className="input-base rounded-lg px-3 py-2 flex flex-wrap items-center gap-1.5 min-h-[42px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(med => (
          <span
            key={med}
            className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs font-medium px-2 py-1 rounded-md"
          >
            {med}
            <button
              onClick={(e) => { e.stopPropagation(); removeMedicine(med) }}
              className="hover:text-accent-hover transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1 flex-1 min-w-[120px]">
          {value.length === 0 && query === '' && (
            <Search className="w-3.5 h-3.5 text-txt-3" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder={value.length === 0 ? placeholder : 'Add more…'}
            className="bg-transparent outline-none text-sm text-txt-1 placeholder:text-txt-3 flex-1 min-w-0"
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface-1 border border-border rounded-lg shadow-lg overflow-auto max-h-[200px] animate-fade-in"
        >
          {suggestions.map((med, idx) => (
            <button
              key={med}
              onMouseDown={(e) => { e.preventDefault(); addMedicine(med) }}
              onMouseEnter={() => setHighlightIdx(idx)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                idx === highlightIdx
                  ? 'bg-accent/10 text-accent'
                  : 'text-txt-1 hover:bg-surface-2'
              }`}
            >
              {highlightMatch(med, query)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
