import { DIAGNOSIS_DATA } from '../data/diagnosticData.js'
import { ICONS } from './icons.js'
import { CircleHelp } from 'lucide-react'

export default function ChipList({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2.5 px-5 pb-5 pt-1">
      {Object.entries(DIAGNOSIS_DATA).map(([key, entry]) => {
        const IconComponent = ICONS[entry.iconKey] || CircleHelp
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="flex items-center gap-2 border-2 border-stone-900 bg-white hover:bg-amber-400 active:translate-y-0.5 px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all shadow-neo-sm neo-btn cursor-pointer"
          >
            <IconComponent size={16} className="text-stone-800" />
            <span>{entry.label}</span>
          </button>
        )
      })}
    </div>
  )
}
