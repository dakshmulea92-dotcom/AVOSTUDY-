import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Pause,
  Play,
  RotateCcw,
  Youtube,
} from 'lucide-react';
import { FocusSessionLog, NavTab, Subject, TimetableSlot } from '../types/study';
import {
  formatExamCountdown,
  formatTime12h,
  getDaysUntilExam,
  getSubjectYouTubeUrl,
  getTodayDayName,
} from '../utils/youtube';

interface OverviewViewProps {
  subjects: Subject[];
  timetable: TimetableSlot[];
  sessions: FocusSessionLog[];
  dailyIntention: string;
  timerSecondsLeft: number;
  timerDurationSeconds: number;
  timerRunning: boolean;
  timerModeLabel: string;
  timerSubjectId: string;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onChangeTimerSubject: (id: string) => void;
  onToggleSlotComplete: (slotId: string) => void;
  onNavigate: (tab: NavTab) => void;
}

function formatClock(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function OverviewView({
  subjects,
  timetable,
  sessions,
  dailyIntention,
  timerSecondsLeft,
  timerDurationSeconds,
  timerRunning,
  timerModeLabel,
  timerSubjectId,
  onToggleTimer,
  onResetTimer,
  onChangeTimerSubject,
  onToggleSlotComplete,
  onNavigate,
}: OverviewViewProps) {
  const todayName = getTodayDayName();
  const todaysSlots = timetable
    .filter((s) => s.day === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const completedTodaySlots = todaysSlots.filter((s) => s.completed).length;

  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = subjects.reduce(
    (acc, s) => acc + s.topics.filter((t) => t.completed).length,
    0
  );

  const todayDateStr = new Date().toISOString().slice(0, 10);
  const focusMinutesToday = sessions
    .filter((s) => s.mode === 'Focus' && s.completedAt.slice(0, 10) === todayDateStr)
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const upcomingSubjects = [...subjects]
    .filter((s) => getDaysUntilExam(s.examDate) >= 0)
    .sort((a, b) => getDaysUntilExam(a.examDate) - getDaysUntilExam(b.examDate));
  const nearestExam = upcomingSubjects[0];

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const activeTimerSubject = subjectMap.get(timerSubjectId);

  const progressRatio =
    timerDurationSeconds > 0
      ? (timerDurationSeconds - timerSecondsLeft) / timerDurationSeconds
      : 0;

  return (
    <div className="space-y-8">
      {/* Hero Workspace Banner */}
      <section className="rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="text-xs font-semibold text-[#4A6B22]">
            {todayName} Study Hub · Offline Exam Workspace
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3B2616] tracking-tight text-balance">
            Stay calm, focused, and exam-ready
          </h1>
          <p className="text-sm sm:text-base text-[#6B4C35] leading-relaxed">
            {dailyIntention ? (
              <>
                Today’s goal: <span className="font-semibold text-[#3B2616]">{dailyIntention}</span>
              </>
            ) : (
              'Plan your weekly timetable, track subject chapters, start a focus session, or jump straight to video lectures on YouTube.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5C3D24] hover:bg-[#472F1B] text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <Youtube className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Learn via YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => onNavigate('timetable')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#CED7BA] bg-[#EFF4E3] hover:bg-[#E4ECCF] text-[#3B2616] text-sm font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <Calendar className="w-4 h-4 shrink-0 text-[#4A6B22]" aria-hidden="true" />
            <span>Open Timetable</span>
          </button>
        </div>
      </section>

      {/* 4-Column Summary Metrics Row */}
      <section aria-label="Study Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-[#FFFFFF] border border-[#DCE3CC] p-5 space-y-1.5">
          <div className="text-xs font-medium text-[#7B583B]">Today’s Schedule</div>
          <div className="font-mono-tabular text-2xl font-semibold text-[#3B2616]">
            {completedTodaySlots} / {todaysSlots.length}
          </div>
          <div className="text-xs text-[#6B4C35]">
            {todaysSlots.length === 0
              ? `No blocks set for ${todayName}`
              : 'Study blocks completed today'}
          </div>
        </div>

        <div className="rounded-xl bg-[#FFFFFF] border border-[#DCE3CC] p-5 space-y-1.5">
          <div className="text-xs font-medium text-[#7B583B]">Syllabus Topics</div>
          <div className="font-mono-tabular text-2xl font-semibold text-[#3B2616]">
            {completedTopics} / {totalTopics}
          </div>
          <div className="text-xs text-[#6B4C35]">
            Across {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}
          </div>
        </div>

        <div className="rounded-xl bg-[#FFFFFF] border border-[#DCE3CC] p-5 space-y-1.5">
          <div className="text-xs font-medium text-[#7B583B]">Focus Time Today</div>
          <div className="font-mono-tabular text-2xl font-semibold text-[#4A6B22]">
            {focusMinutesToday} min
          </div>
          <div className="text-xs text-[#6B4C35]">
            Logged focus study minutes
          </div>
        </div>

        <div className="rounded-xl bg-[#FFFFFF] border border-[#DCE3CC] p-5 space-y-1.5">
          <div className="text-xs font-medium text-[#7B583B]">Next Upcoming Exam</div>
          <div className="font-display text-xl font-semibold text-[#3B2616] truncate">
            {nearestExam ? nearestExam.name : 'No exams added'}
          </div>
          <div className="font-mono-tabular text-xs font-medium text-[#5C3D24]">
            {nearestExam ? formatExamCountdown(nearestExam.examDate) : 'Add a subject to start'}
          </div>
        </div>
      </section>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Schedule + Subject Progress */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Timetable Block */}
          <section className="rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#3B2616]">
                  Today’s Timetable ({todayName})
                </h2>
                <p className="text-xs text-[#6B4C35]">
                  Check off slots as you finish or jump to a YouTube lecture.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('timetable')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A6B22] hover:text-[#3D591B] whitespace-nowrap shrink-0"
              >
                <span>Full Week</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaysSlots.length === 0 ? (
              <div className="rounded-xl bg-[#F8FAF2] border border-[#E5ECD7] p-6 text-center space-y-3">
                <p className="text-sm text-[#6B4C35]">
                  No study slots scheduled for {todayName} yet.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('timetable')}
                  className="px-4 py-2 rounded-lg bg-[#4A6B22] hover:bg-[#3D591B] text-white text-xs font-medium transition-colors"
                >
                  Plan {todayName} Schedule
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#EAEFDE]">
                {todaysSlots.map((slot) => {
                  const subj = subjectMap.get(slot.subjectId);
                  const ytUrl = getSubjectYouTubeUrl(subj, slot.topicFocus);
                  return (
                    <div
                      key={slot.id}
                      className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => onToggleSlotComplete(slot.id)}
                          aria-label={
                            slot.completed ? 'Mark slot incomplete' : 'Mark slot complete'
                          }
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            slot.completed
                              ? 'bg-[#4A6B22] border-[#4A6B22] text-white'
                              : 'border-[#BFC9AA] bg-white hover:border-[#4A6B22]'
                          }`}
                        >
                          {slot.completed && <Check className="w-3.5 h-3.5" />}
                        </button>
                        <div className="min-w-0">
                          <div
                            className={`text-sm font-semibold truncate ${
                              slot.completed
                                ? 'line-through text-[#8C735D]'
                                : 'text-[#3B2616]'
                            }`}
                          >
                            {subj ? subj.name : 'General Study'}
                          </div>
                          <div className="text-xs text-[#6B4C35] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-mono-tabular">
                              {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                            </span>
                            {slot.topicFocus && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="truncate">{slot.topicFocus}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <a
                        href={ytUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CED7BA] bg-[#F8FAF2] hover:bg-[#EFF4E3] text-xs font-medium text-[#5C3D24] transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
                      >
                        <Youtube className="w-3.5 h-3.5 text-[#5C3D24]" aria-hidden="true" />
                        <span>Learn via YouTube</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Subject Checklist Progress */}
          <section className="rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#3B2616]">
                  Subject Readiness
                </h2>
                <p className="text-xs text-[#6B4C35]">
                  Track your syllabus checklist and upcoming exam dates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('subjects')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A6B22] hover:text-[#3D591B] whitespace-nowrap shrink-0"
              >
                <span>Manage Subjects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className="rounded-xl bg-[#F8FAF2] border border-[#E5ECD7] p-6 text-center space-y-3">
                <p className="text-sm text-[#6B4C35]">
                  Your subject list is empty. Add your exam subjects to track chapters.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('subjects')}
                  className="px-4 py-2 rounded-lg bg-[#4A6B22] hover:bg-[#3D591B] text-white text-xs font-medium transition-colors"
                >
                  Add First Subject
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {subjects.slice(0, 4).map((subj) => {
                  const done = subj.topics.filter((t) => t.completed).length;
                  const total = subj.topics.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                  return (
                    <div key={subj.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#3B2616] truncate">
                            {subj.name}
                          </div>
                          <div className="text-xs text-[#6B4C35] flex items-center gap-2">
                            <span>{subj.priority} priority</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">
                              {formatExamCountdown(subj.examDate)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">
                              {done}/{total} topics
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono-tabular text-xs font-semibold text-[#4A6B22]">
                            {pct}%
                          </span>
                          <a
                            href={getSubjectYouTubeUrl(subj)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Learn ${subj.name} via YouTube`}
                            className="p-1.5 rounded-lg border border-[#CED7BA] bg-[#F8FAF2] hover:bg-[#EFF4E3] text-[#5C3D24] transition-colors"
                            title={`Learn ${subj.name} via YouTube`}
                          >
                            <Youtube className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#EFF4E3] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#4A6B22] transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Quick Focus Timer + Study Links */}
        <div className="lg:col-span-5 space-y-6">
          <section className="rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-6 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4A6B22]" aria-hidden="true" />
                <h2 className="font-display text-lg font-semibold text-[#3B2616]">
                  Quick Focus Timer
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('timer')}
                className="text-xs font-semibold text-[#4A6B22] hover:text-[#3D591B] whitespace-nowrap"
              >
                Full Timer Studio
              </button>
            </div>

            <div className="rounded-xl bg-[#EFF4E3] border border-[#DCE3CC] p-5 text-center space-y-4">
              <div className="text-xs font-semibold text-[#5C3D24]">
                {timerModeLabel}
              </div>

              <div className="font-mono-tabular text-5xl font-bold text-[#3B2616] tracking-tight">
                {formatClock(timerSecondsLeft)}
              </div>

              <div className="h-1.5 w-full rounded-full bg-[#DCE3CC] overflow-hidden">
                <div
                  className="h-full bg-[#4A6B22] transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progressRatio * 100))}%` }}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="overview-timer-subject"
                  className="block text-xs font-medium text-[#6B4C35]"
                >
                  Studying Subject
                </label>
                <select
                  id="overview-timer-subject"
                  value={timerSubjectId}
                  onChange={(e) => onChangeTimerSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#CED7BA] text-sm text-[#3B2616] focus:outline-none focus:border-[#4A6B22]"
                >
                  <option value="">General Exam Prep</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onToggleTimer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A6B22] hover:bg-[#3D591B] text-white text-sm font-medium transition-colors whitespace-nowrap"
                >
                  {timerRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start Focus</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onResetTimer}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#CED7BA] bg-white hover:bg-[#F8FAF2] text-sm font-medium text-[#5C3D24] transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {activeTimerSubject && (
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-[#6B4C35] min-w-0">
                  <BookOpen className="w-3.5 h-3.5 text-[#4A6B22] shrink-0" />
                  <span className="truncate">Need a refresher on {activeTimerSubject.name}?</span>
                </div>
                <a
                  href={getSubjectYouTubeUrl(activeTimerSubject)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#5C3D24] hover:text-[#3B2616] underline underline-offset-2 whitespace-nowrap shrink-0"
                >
                  Watch on YouTube
                </a>
              </div>
            )}
          </section>

          {/* Direct YouTube Study Channels Card */}
          <section className="rounded-2xl bg-[#5C3D24] text-white p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-semibold">
                Learn via YouTube
              </h2>
              <p className="text-xs text-[#E7D8CB] leading-relaxed">
                Open YouTube directly or jump into focused exam-prep topic searches without distractions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white text-[#3B2616] hover:bg-[#EFF4E3] text-xs font-semibold transition-colors"
              >
                <span>Open YouTube Home</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              <a
                href="https://www.youtube.com/results?search_query=study+with+me+pomodoro+no+music"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#472F1B] hover:bg-[#3A2515] text-white border border-[#775438] text-xs font-medium transition-colors"
              >
                <span>Study With Me</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              <a
                href="https://www.youtube.com/results?search_query=active+recall+and+spaced+repetition+exam+tips"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#472F1B] hover:bg-[#3A2515] text-white border border-[#775438] text-xs font-medium transition-colors"
              >
                <span>Exam Strategies</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              <a
                href="https://www.youtube.com/results?search_query=lo+fi+or+rain+sounds+for+studying"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#472F1B] hover:bg-[#3A2515] text-white border border-[#775438] text-xs font-medium transition-colors"
              >
                <span>Ambient Study Audio</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
