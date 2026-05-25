import { useState, useRef } from 'react'
import { X, Plus } from 'lucide-react'

export default function TagInput({ label, value = [], onChange, placeholder = 'Type and press Enter…' }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const addTag = (tag) => {
    const trimmed = tag.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInput('')
  }

  const removeTag = (tag) => {
    onChange(value.filter(t => t !== tag))
  }

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-txt-2 mb-1.5">{label}</label>
      <div
        className="input-base rounded-lg px-3 py-2 flex flex-wrap items-center gap-1.5 min-h-[42px] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-surface-3 text-txt-2 text-xs font-medium px-2 py-1 rounded-md"
          >
            {tag}
            <button
              onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
              className="hover:text-txt-1 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : 'Add…'}
          className="bg-transparent outline-none text-sm text-txt-1 placeholder:text-txt-3 flex-1 min-w-[80px]"
        />
      </div>
    </div>
  )
}
