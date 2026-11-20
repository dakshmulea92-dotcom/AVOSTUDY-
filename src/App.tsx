import { useCallback, useEffect, useState } from 'react';
import { FocusTimerView, TIMER_PRESETS, TimerPreset } from './components/FocusTimerView';
import { MotivationModal } from './components/MotivationModal';
import { OverviewView } from './components/OverviewView';
import { SubjectsView } from './components/SubjectsView';
import { TimetableView } from './components/TimetableView';
import { TopBar } from './components/TopBar';
import { MOTIVATION_QUOTES, getDailyQuoteIndex } from './data/quotes';
import { FocusSessionLog, NavTab, Subject, TimetableSlot } from './types/study';
import { playFocusChime } from './utils/sound';
import {
  getTodayDateString,
  hasSeenTodayMotivation,
  loadDailyIntention,
  loadFocusSessions,
  loadSubjects,
  loadTimetable,
  markTodayMotivationSeen,
  saveDailyIntention,
  saveFocusSessions,
  saveSubjects,
  saveTimetable,
} from './utils/storage';

function formatClock(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [subjects, setSubjects] = useState<Subject[]>(() => loadSubjects());
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => loadTimetable());
  const [sessions, setSessions] = useState<FocusSessionLog[]>(() => loadFocusSessions());
  const [dailyIntention, setDailyIntention] = useState<string>(() => loadDailyIntention());

  // Daily Motivation Popup state
  const [motivationOpen, setMotivationOpen] = useState<boolean>(() => !hasSeenTodayMotivation());
  const [quoteIndex, setQuoteIndex] = useState<number>(() =>
    getDailyQuoteIndex(getTodayDateString())
  );

  // Focus Timer state
  const [activePresetId, setActivePresetId] = useState<string>('pomodoro');
  const [timerDurationSeconds, setTimerDurationSeconds] = useState<number>(25 * 60);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'Focus' | 'Break'>('Focus');
  const [timerModeLabel, setTimerModeLabel] = useState<string>('Pomodoro (25m)');
  const [timerSubjectId, setTimerSubjectId] = useState<string>(() => loadSubjects()[0]?.id || '');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completionNotice, setCompletionNotice] = useState<string | null>(null);

  // Persist changes to localStorage
  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    saveTimetable(timetable);
  }, [timetable]);

  useEffect(() => {
    saveFocusSessions(sessions);
  }, [sessions]);

  const recordCompletedSession = useCallback(
    (elapsedSeconds: number) => {
      const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
      const matchedSubject = subjects.find((s) => s.id === timerSubjectId);
      const entry: FocusSessionLog = {
        id: `sess-${Date.now()}`,
        subjectId: timerSubjectId,
        subjectName: matchedSubject ? matchedSubject.name : 'General Exam Prep',
        durationMinutes: minutes,
        mode: timerMode,
        completedAt: new Date().toISOString(),
      };
      setSessions((prev) => [entry, ...prev]);
      setCompletionNotice(
        `${timerMode} session complete: ${minutes} min logged for ${entry.subjectName}.`
      );
      if (soundEnabled) {
        playFocusChime();
      }
    },
    [subjects, timerSubjectId, timerMode, soundEnabled]
  );

  // Timer tick effect
  useEffect(() => {
    if (!timerRunning) return;

    const interval = window.setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          recordCompletedSession(timerDurationSeconds);
          return timerDurationSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerRunning, timerDurationSeconds, recordCompletedSession]);

  // Keep document title synced when timer is running
  useEffect(() => {
    if (timerRunning) {
      document.title = `${formatClock(timerSecondsLeft)} · AvoStudy`;
    } else {
      document.title = 'AvoStudy — Exam Preparation Planner';
    }
  }, [timerRunning, timerSecondsLeft]);

  const handleCloseMotivation = () => {
    markTodayMotivationSeen();
    setMotivationOpen(false);
  };

  const handleUpdateIntention = (text: string) => {
    setDailyIntention(text);
    saveDailyIntention(text);
  };

  // Subject CRUD handlers
  const handleAddSubject = (newSubj: Omit<Subject, 'id'>) => {
    const created: Subject = {
      ...newSubj,
      id: `subj-${Date.now()}`,
    };
    setSubjects((prev) => [created, ...prev]);
    if (!timerSubjectId) {
      setTimerSubjectId(created.id);
    }
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    setTimetable((prev) => prev.filter((slot) => slot.subjectId !== subjectId));
    if (timerSubjectId === subjectId) {
      setTimerSubjectId('');
    }
  };

  const handleToggleTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              topics: s.topics.map((t) =>
                t.id === topicId ? { ...t, completed: !t.completed } : t
              ),
            }
          : s
      )
    );
  };

  const handleAddTopic = (subjectId: string, title: string) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              topics: [
                ...s.topics,
                { id: `topic-${Date.now()}`, title, completed: false },
              ],
            }
          : s
      )
    );
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) }
          : s
      )
    );
  };

  // Timetable CRUD handlers
  const handleAddSlot = (newSlot: Omit<TimetableSlot, 'id' | 'completed'>) => {
    const created: TimetableSlot = {
      ...newSlot,
      id: `slot-${Date.now()}`,
      completed: false,
    };
    setTimetable((prev) => [...prev, created]);
  };

  const handleToggleSlotComplete = (slotId: string) => {
    setTimetable((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, completed: !slot.completed } : slot
      )
    );
  };

  const handleDeleteSlot = (slotId: string) => {
    setTimetable((prev) => prev.filter((slot) => slot.id !== slotId));
  };

  // Timer actions
  const handleSelectPreset = (preset: TimerPreset) => {
    setTimerRunning(false);
    setActivePresetId(preset.id);
    setTimerMode(preset.mode);
    setTimerModeLabel(preset.label);
    setTimerDurationSeconds(preset.minutes * 60);
    setTimerSecondsLeft(preset.minutes * 60);
  };

  const handleSetCustomMinutes = (minutes: number) => {
    setTimerRunning(false);
    setActivePresetId('custom');
    setTimerMode('Focus');
    setTimerModeLabel(`Custom Focus (${minutes}m)`);
    setTimerDurationSeconds(minutes * 60);
    setTimerSecondsLeft(minutes * 60);
  };

  const handleToggleTimer = () => {
    setCompletionNotice(null);
    setTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSecondsLeft(timerDurationSeconds);
  };

  const handleCompleteSessionNow = () => {
    setTimerRunning(false);
    const elapsed = Math.max(60, timerDurationSeconds - timerSecondsLeft);
    recordCompletedSession(elapsed);
    setTimerSecondsLeft(timerDurationSeconds);
  };

  const handleStartFocusForSubject = (subjectId: string) => {
    setTimerSubjectId(subjectId);
    setActiveTab('timer');
    if (!timerRunning) {
      const focusPreset = TIMER_PRESETS[0];
      if (timerMode === 'Break') {
        handleSelectPreset(focusPreset);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF2] text-[#3B2616]">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMotivation={() => setMotivationOpen(true)}
        timerRunning={timerRunning}
        timerDisplay={formatClock(timerSecondsLeft)}
      />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {completionNotice && (
          <div
            role="status"
            className="rounded-xl bg-[#EFF4E3] border border-[#4A6B22] px-4 py-3 flex items-center justify-between gap-3 text-sm text-[#3B2616]"
          >
            <span className="font-medium">{completionNotice}</span>
            <button
              type="button"
              onClick={() => setCompletionNotice(null)}
              className="text-xs font-semibold text-[#4A6B22] hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === 'overview' && (
          <OverviewView
            subjects={subjects}
            timetable={timetable}
            sessions={sessions}
            dailyIntention={dailyIntention}
            timerSecondsLeft={timerSecondsLeft}
            timerDurationSeconds={timerDurationSeconds}
            timerRunning={timerRunning}
            timerModeLabel={timerModeLabel}
            timerSubjectId={timerSubjectId}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onChangeTimerSubject={setTimerSubjectId}
            onToggleSlotComplete={handleToggleSlotComplete}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableView
            subjects={subjects}
            timetable={timetable}
            onAddSlot={handleAddSlot}
            onToggleSlotComplete={handleToggleSlotComplete}
            onDeleteSlot={handleDeleteSlot}
            onStartFocusForSubject={handleStartFocusForSubject}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectsView
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
            onToggleTopic={handleToggleTopic}
            onAddTopic={handleAddTopic}
            onDeleteTopic={handleDeleteTopic}
            onStartFocusForSubject={handleStartFocusForSubject}
          />
        )}

        {activeTab === 'timer' && (
          <FocusTimerView
            subjects={subjects}
            sessions={sessions}
            activePresetId={activePresetId}
            timerSecondsLeft={timerSecondsLeft}
            timerDurationSeconds={timerDurationSeconds}
            timerRunning={timerRunning}
            timerSubjectId={timerSubjectId}
            soundEnabled={soundEnabled}
            onSelectPreset={handleSelectPreset}
            onSetCustomMinutes={handleSetCustomMinutes}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onCompleteSessionNow={handleCompleteSessionNow}
            onChangeTimerSubject={setTimerSubjectId}
            onToggleSound={() => setSoundEnabled((prev) => !prev)}
            onClearSessions={() => setSessions([])}
          />
        )}
      </main>

      <footer className="border-t border-[#DCE3CC] bg-[#F3F6EA] mt-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B4C35]">
          <span>AvoStudy · Offline-ready exam preparation planner</span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setMotivationOpen(true)}
              className="hover:text-[#3B2616] transition-colors"
            >
              Daily Motivation
            </button>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#3B2616] transition-colors"
            >
              YouTube Study
            </a>
          </div>
        </div>
      </footer>

      <MotivationModal
        isOpen={motivationOpen}
        quoteIndex={quoteIndex}
        dailyIntention={dailyIntention}
        onChangeIntention={handleUpdateIntention}
        onNextQuote={() => setQuoteIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length)}
        onPrevQuote={() =>
          setQuoteIndex(
            (prev) => (prev - 1 + MOTIVATION_QUOTES.length) % MOTIVATION_QUOTES.length
          )
        }
        onClose={handleCloseMotivation}
      />
    </div>
  );
}
