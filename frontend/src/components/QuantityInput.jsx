import { useState } from 'react'
import { MdAdd, MdRemove } from 'react-icons/md'

/**
 * QuantityInput — type a number OR click +/−
 * Props:
 *   value      — current quantity (number)
 *   max        — max allowed (stock)
 *   min        — minimum (default 1)
 *   onChange   — called with new quantity (number)
 *   onRemove   — called when quantity goes below min (optional)
 *   size       — 'sm' | 'md' (default 'sm')
 */
export default function QuantityInput({
  value,
  max = 999,
  min = 1,
  onChange,
  onRemove,
  size = 'sm',
}) {
  const [inputVal, setInputVal] = useState(String(value))
  const [focused, setFocused] = useState(false)

  const apply = (raw) => {
    const num = parseInt(raw, 10)
    if (isNaN(num) || raw === '') {
      // Restore to current value if invalid
      setInputVal(String(value))
      return
    }
    const clamped = Math.min(Math.max(num, 0), max)
    if (clamped < min) {
      if (onRemove) {
        onRemove()
      } else {
        onChange(min)
        setInputVal(String(min))
      }
    } else {
      onChange(clamped)
      setInputVal(String(clamped))
    }
  }

  // Keep input in sync when value changes externally
  if (!focused && String(value) !== inputVal) {
    setInputVal(String(value))
  }

  const decrement = () => {
    const next = value - 1
    if (next < min) {
      if (onRemove) onRemove()
    } else {
      onChange(next)
      setInputVal(String(next))
    }
  }

  const increment = () => {
    if (value >= max) return
    const next = value + 1
    onChange(next)
    setInputVal(String(next))
  }

  const btn = size === 'sm'
    ? 'w-7 h-7 text-sm'
    : 'w-9 h-9 text-base'

  const inp = size === 'sm'
    ? 'w-10 h-7 text-sm'
    : 'w-14 h-9 text-base'

  return (
    <div className="flex items-center gap-1">
      {/* Decrement */}
      <button
        type="button"
        onClick={decrement}
        className={`${btn} rounded-lg border border-slate-200 dark:border-slate-600
                    flex items-center justify-center
                    text-slate-600 dark:text-slate-300
                    hover:border-brand-400 hover:text-brand-600
                    active:scale-95 transition-all`}
        aria-label="Decrease quantity"
      >
        <MdRemove />
      </button>

      {/* Editable number input */}
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={focused ? inputVal : value}
        onChange={e => setInputVal(e.target.value)}
        onFocus={() => { setFocused(true); setInputVal(String(value)) }}
        onBlur={e => { setFocused(false); apply(e.target.value) }}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.target.blur() }
          if (e.key === 'Escape') { setInputVal(String(value)); e.target.blur() }
        }}
        className={`${inp} text-center font-bold
                    rounded-lg border border-slate-200 dark:border-slate-600
                    bg-white dark:bg-slate-800
                    text-slate-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
                    transition-all
                    [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none`}
        aria-label="Quantity"
      />

      {/* Increment */}
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className={`${btn} rounded-lg border border-slate-200 dark:border-slate-600
                    flex items-center justify-center
                    text-slate-600 dark:text-slate-300
                    hover:border-brand-400 hover:text-brand-600
                    active:scale-95 transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <MdAdd />
      </button>

      {/* Stock hint */}
      {max < 10 && max > 0 && (
        <span className="text-xs text-amber-500 ml-1 whitespace-nowrap">
          {max} left
        </span>
      )}
    </div>
  )
}