import { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Pause,
  Play,
  RotateCcw,
  Trash2,
  Volume2,
  VolumeX,
  Youtube,
} from 'lucide-react';
import { FocusSessionLog, Subject } from '../types/study';
import { getSubjectYouTubeUrl } from '../utils/youtube';

export interface TimerPreset {
  id: string;
  label: string;
  minutes: number;
  mode: 'Focus' | 'Break';
}

export const TIMER_PRESETS: TimerPreset[] = [
  { id: 'pomodoro', label: 'Pomodoro (25m)', minutes: 25, mode: 'Focus' },
  { id: 'deep', label: 'Deep Study (50m)', minutes: 50, mode: 'Focus' },
  { id: 'quick', label: 'Quick Review (15m)', minutes: 15, mode: 'Focus' },
  { id: 'short-break', label: 'Short Break (5m)', minutes: 5, mode: 'Break' },
  { id: 'long-break', label: 'Long Break (15m)', minutes: 15, mode: 'Break' },
];

interface FocusTimerViewProps {
  subjects: Subject[];
  sessions: FocusSessionLog[];
  activePresetId: string;
  timerSecondsLeft: number;
  timerDurationSeconds: number;
  timerRunning: boolean;
  timerSubjectId: string;
  soundEnabled: boolean;
  onSelectPreset: (preset: TimerPreset) => void;
  onSetCustomMinutes: (minutes: number) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onCompleteSessionNow: () => void;
  onChangeTimerSubject: (subjectId: string) => void;
  onToggleSound: () => void;
  onClearSessions: () => void;
}

function formatClock(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function FocusTimerView({
  subjects,
  sessions,
  activePresetId,
  timerSecondsLeft,
  timerDurationSeconds,
  timerRunning,
  timerSubjectId,
  soundEnabled,
  onSelectPreset,
  onSetCustomMinutes,
  onToggleTimer,
  onResetTimer,
  onCompleteSessionNow,
  onChangeTimerSubject,
  onToggleSound,
  onClearSessions,
}: FocusTimerViewProps) {
  const [customMins, setCustomMins] = useState('35');

  const activeSubject = subjects.find((s) => s.id === timerSubjectId);

  const radius = 104;
  const circumference = 2 * Math.PI * radius;
  const progress =
    timerDurationSeconds > 0
      ? (timerDurationSeconds - timerSecondsLeft) / timerDurationSeconds
      : 0;
  const strokeDashoffset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysSessions = sessions.filter((s) => s.completedAt.slice(0, 10) === todayStr);
  const totalFocusToday = todaysSessions
    .filter((s) => s.mode === 'Focus')
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(customMins);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 180) return;
    onSetCustomMinutes(Math.round(parsed));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2616]">
            Focus Timer Studio
          </h1>
          <p className="text-sm text-[#6B4C35]">
            Stay in deep study flow with timed intervals, sound chimes, and session tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#DCE3CC] bg-white hover:bg-[#EFF4E3] text-xs font-semibold text-[#5C3D24] transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-[#4A6B22]" />
              <span>Chime Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-[#8C735D]" />
              <span>Chime Sound Muted</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Timer Column */}
        <section className="lg:col-span-7 rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-6 sm:p-8 space-y-6">
          {/* Preset Segmented Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#EFF4E3] border border-[#DCE3CC]">
            {TIMER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  activePresetId === preset.id
                    ? 'bg-white text-[#3B2616] shadow-xs'
                    : 'text-[#6B4C35] hover:text-[#3B2616]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Circular Progress Ring */}
          <div className="flex flex-col items-center justify-center py-4 space-y-6">
            <div className="relative w-60 h-60 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="none"
                  stroke="#EFF4E3"
                  strokeWidth="12"
                />
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  fill="none"
                  stroke={activePresetId.includes('break') ? '#7B583B' : '#4A6B22'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-[#6B4C35]">
                  {activePresetId.includes('break') ? 'Break Time' : 'Focus Time'}
                </span>
                <span className="font-mono-tabular text-5xl font-bold text-[#3B2616] tracking-tight mt-1">
                  {formatClock(timerSecondsLeft)}
                </span>
                <span className="text-xs text-[#7B583B] mt-1 max-w-[160px] truncate">
                  {activeSubject ? activeSubject.name : 'General Exam Prep'}
                </span>
              </div>
            </div>

            {/* Primary Timer Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onToggleTimer}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#4A6B22] hover:bg-[#3D591B] text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Timer</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onResetTimer}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[#CED7BA] bg-[#F8FAF2] hover:bg-[#EFF4E3] text-sm font-medium text-[#5C3D24] transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={onCompleteSessionNow}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[#CED7BA] bg-white hover:bg-[#EFF4E3] text-sm font-medium text-[#4A6B22] transition-colors whitespace-nowrap"
                title="Log this session early as completed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log Done</span>
              </button>
            </div>
          </div>

          {/* Subject Tagging & Custom Duration */}
          <div className="pt-4 border-t border-[#EAEFDE] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="timer-subject-select"
                className="block text-xs font-medium text-[#6B4C35]"
              >
                Active Subject
              </label>
              <select
                id="timer-subject-select"
                value={timerSubjectId}
                onChange={(e) => onChangeTimerSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm text-[#3B2616] focus:outline-none focus:border-[#4A6B22]"
              >
                <option value="">General Exam Prep</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleApplyCustom} className="space-y-1.5">
              <label
                htmlFor="custom-minutes"
                className="block text-xs font-medium text-[#6B4C35]"
              >
                Custom Minutes (1–180)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="custom-minutes"
                  type="number"
                  min={1}
                  max={180}
                  value={customMins}
                  onChange={(e) => setCustomMins(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm font-mono-tabular text-[#3B2616] focus:outline-none focus:border-[#4A6B22]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#5C3D24] hover:bg-[#472F1B] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  Set
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Session Log & YouTube Quick Link Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today's Stats & Log */}
          <section className="rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#3B2616]">
                  Focus Session Log
                </h2>
                <p className="text-xs text-[#6B4C35]">
                  Today’s total:{' '}
                  <span className="font-mono-tabular font-semibold text-[#4A6B22]">
                    {totalFocusToday} min
                  </span>{' '}
                  across {todaysSessions.filter((s) => s.mode === 'Focus').length} sessions
                </p>
              </div>

              {sessions.length > 0 && (
                <button
                  type="button"
                  onClick={onClearSessions}
                  aria-label="Clear session log"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#8C735D] hover:text-[#A63A2B] hover:bg-[#F5E9E6] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {sessions.length === 0 ? (
              <div className="rounded-xl bg-[#F8FAF2] border border-[#E5ECD7] p-6 text-center text-xs text-[#6B4C35]">
                Complete a focus timer block to record your study streak here.
              </div>
            ) : (
              <div className="divide-y divide-[#EAEFDE] max-h-80 overflow-y-auto pr-1">
                {sessions.slice(0, 12).map((session) => (
                  <div
                    key={session.id}
                    className="py-2.5 flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-[#3B2616] truncate">
                        {session.subjectName}
                      </div>
                      <div className="text-xs text-[#6B4C35]">
                        {session.mode} ·{' '}
                        <span className="font-mono-tabular">
                          {new Date(session.completedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono-tabular text-xs font-semibold text-[#4A6B22] shrink-0">
                      +{session.durationMinutes}m
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Learn via YouTube Card */}
          <section className="rounded-2xl bg-[#EFF4E3] border border-[#DCE3CC] p-6 space-y-3">
            <h2 className="font-display text-base font-semibold text-[#3B2616]">
              Study Along on YouTube
            </h2>
            <p className="text-xs text-[#5C3D24] leading-relaxed">
              Open a lecture or a quiet “Study With Me” video for{' '}
              <span className="font-semibold">
                {activeSubject ? activeSubject.name : 'your current topic'}
              </span>
              .
            </p>
            <a
              href={getSubjectYouTubeUrl(activeSubject)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5C3D24] hover:bg-[#472F1B] text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <Youtube className="w-4 h-4 shrink-0" />
              <span>Learn via YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
