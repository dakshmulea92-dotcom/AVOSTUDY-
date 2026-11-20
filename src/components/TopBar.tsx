import { Sparkles } from 'lucide-react';
import { NavTab } from '../types/study';
import { AvocadoMark } from './AvocadoMark';

interface TopBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenMotivation: () => void;
  timerRunning: boolean;
  timerDisplay: string;
}

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'timetable', label: 'Timetable' },
  { id: 'subjects', label: 'Subjects' },
  { id: 'timer', label: 'Focus Timer' },
];

export function TopBar({
  activeTab,
  onSelectTab,
  onOpenMotivation,
  timerRunning,
  timerDisplay,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAF2]/95 backdrop-blur-sm border-b border-[#DCE3CC]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A6B22] rounded-md"
        >
          <AvocadoMark className="w-7 h-7 shrink-0" />
          <span className="font-display text-xl font-bold tracking-tight text-[#3B2616] whitespace-nowrap shrink-0">
            AvoStudy
          </span>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A6B22] ${
                  isActive
                    ? 'text-[#3B2616] font-semibold'
                    : 'text-[#6B4C35] hover:text-[#3B2616]'
                }`}
              >
                <span>
                  {item.label}
                  {item.id === 'timer' && timerRunning ? ` (${timerDisplay})` : ''}
                </span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A6B22] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenMotivation}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4A6B22] hover:bg-[#3D591B] text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2616]"
          >
            <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Daily Motivation</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden border-t border-[#E6ECD8] px-3 py-1.5 flex items-center justify-between gap-1 overflow-x-auto"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-[#4A6B22] text-white'
                  : 'text-[#6B4C35] hover:bg-[#EFF4E3]'
              }`}
            >
              {item.label}
              {item.id === 'timer' && timerRunning ? ` · ${timerDisplay}` : ''}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
