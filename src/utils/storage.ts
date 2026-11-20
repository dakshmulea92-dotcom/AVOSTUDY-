import { FocusSessionLog, Subject, TimetableSlot } from '../types/study';
import { createStarterSubjects, createStarterTimetable } from '../data/defaults';

const KEYS = {
  SUBJECTS: 'avostudy_subjects_v1',
  TIMETABLE: 'avostudy_timetable_v1',
  SESSIONS: 'avostudy_focus_sessions_v1',
  MOTIVATION_DISMISSED_DATE: 'avostudy_motivation_date_v1',
  DAILY_INTENTION: 'avostudy_daily_intention_v1',
};

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadSubjects(): Subject[] {
  try {
    const raw = localStorage.getItem(KEYS.SUBJECTS);
    if (!raw) {
      const starter = createStarterSubjects();
      localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(starter));
      return starter;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : createStarterSubjects();
  } catch {
    return createStarterSubjects();
  }
}

export function saveSubjects(subjects: Subject[]): void {
  try {
    localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(subjects));
  } catch {
    // Ignore storage quota issues safely
  }
}

export function loadTimetable(): TimetableSlot[] {
  try {
    const raw = localStorage.getItem(KEYS.TIMETABLE);
    if (!raw) {
      const starter = createStarterTimetable();
      localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(starter));
      return starter;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : createStarterTimetable();
  } catch {
    return createStarterTimetable();
  }
}

export function saveTimetable(slots: TimetableSlot[]): void {
  try {
    localStorage.setItem(KEYS.TIMETABLE, JSON.stringify(slots));
  } catch {
    // Ignore storage quota issues safely
  }
}

export function loadFocusSessions(): FocusSessionLog[] {
  try {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFocusSessions(sessions: FocusSessionLog[]): void {
  try {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  } catch {
    // Ignore storage quota issues safely
  }
}

export function hasSeenTodayMotivation(): boolean {
  try {
    return localStorage.getItem(KEYS.MOTIVATION_DISMISSED_DATE) === getTodayDateString();
  } catch {
    return false;
  }
}

export function markTodayMotivationSeen(): void {
  try {
    localStorage.setItem(KEYS.MOTIVATION_DISMISSED_DATE, getTodayDateString());
  } catch {
    // Ignore storage quota issues safely
  }
}

export function loadDailyIntention(): string {
  try {
    const raw = localStorage.getItem(KEYS.DAILY_INTENTION);
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    if (parsed && parsed.date === getTodayDateString() && typeof parsed.text === 'string') {
      return parsed.text;
    }
    return '';
  } catch {
    return '';
  }
}

export function saveDailyIntention(text: string): void {
  try {
    localStorage.setItem(
      KEYS.DAILY_INTENTION,
      JSON.stringify({ date: getTodayDateString(), text })
    );
  } catch {
    // Ignore storage quota issues safely
  }
}
