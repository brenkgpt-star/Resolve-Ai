import { DIAGNOSIS_DATA } from '../data/diagnosticData.js'
import { ICONS } from './icons.js'
import { CircleHelp } from 'lucide-react'

export default function ChipList({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2.5 px-4 sm:px-5 pb-5 pt-1">
      {Object.entries(DIAGNOSIS_DATA).map(([key, entry]) => {
        const IconComponent = ICONS[entry.iconKey] || CircleHelp
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="flex items-center gap-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/90 hover:bg-amber-400 dark:hover:bg-amber-400 hover:border-amber-400 text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-stone-950 px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer active:scale-95 min-h-[42px]"
          >
            <IconComponent size={16} className="text-stone-700 dark:text-stone-300 group-hover:text-stone-950 shrink-0" />
            <span>{entry.label}</span>
          </button>
        )
      })}
    </div>
  )
}
