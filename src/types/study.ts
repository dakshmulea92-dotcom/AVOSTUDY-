export type NavTab = 'overview' | 'timetable' | 'subjects' | 'timer';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type SubjectPriority = 'High' | 'Medium' | 'Low';

export interface TopicItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  examDate: string; // YYYY-MM-DD
  priority: SubjectPriority;
  youtubeQuery: string;
  youtubeUrl?: string;
  notes?: string;
  topics: TopicItem[];
}

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h)
  subjectId: string;
  topicFocus: string;
  completed: boolean;
}

export interface FocusSessionLog {
  id: string;
  subjectId: string;
  subjectName: string;
  durationMinutes: number;
  mode: 'Focus' | 'Break';
  completedAt: string; // ISO string
}

export interface MotivationQuote {
  id: string;
  text: string;
  author: string;
  focusTip: string;
}
