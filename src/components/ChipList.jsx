import { DIAGNOSIS_DATA } from '../data/diagnosticData.js'
import { ICONS } from './icons.js'
import { CircleHelp } from 'lucide-react'

export default function ChipList({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 px-4 sm:px-5 pb-5 pt-1">
      {Object.entries(DIAGNOSIS_DATA).map(([key, entry]) => {
        const IconComponent = ICONS[entry.iconKey] || CircleHelp
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="flex items-center gap-2.5 border-2 border-stone-900 bg-white hover:bg-amber-400 active:scale-95 px-4 py-3 sm:px-3.5 sm:py-2 text-sm sm:text-sm font-semibold transition-all shadow-neo-sm neo-btn cursor-pointer min-h-[48px]"
          >
            <IconComponent size={20} className="text-stone-800 shrink-0 sm:hidden" />
            <IconComponent size={16} className="text-stone-800 shrink-0 hidden sm:block" />
            <span>{entry.label}</span>
          </button>
        )
      })}
    </div>
  )
}
