import { Subject } from '../types/study';

export function buildYouTubeLink(queryOrUrl?: string, fallbackTopic?: string): string {
  const trimmed = (queryOrUrl || '').trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  const searchTerm = trimmed || (fallbackTopic || '').trim();
  if (!searchTerm) {
    return 'https://www.youtube.com';
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`;
}

export function getSubjectYouTubeUrl(subject?: Subject, topicFocus?: string): string {
  if (!subject) {
    return buildYouTubeLink(topicFocus || 'study with me exam preparation');
  }
  if (subject.youtubeUrl && subject.youtubeUrl.trim()) {
    return buildYouTubeLink(subject.youtubeUrl);
  }
  const combinedQuery = topicFocus
    ? `${subject.name} ${topicFocus}`
    : subject.youtubeQuery || `${subject.name} lecture`;
  return buildYouTubeLink(combinedQuery);
}

export function getDaysUntilExam(examDate: string): number {
  if (!examDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = examDate.split('-').map(Number);
  if (!y || !m || !d) return 0;
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function formatExamCountdown(examDate: string): string {
  const days = getDaysUntilExam(examDate);
  if (days < 0) return `Exam passed (${Math.abs(days)}d ago)`;
  if (days === 0) return 'Exam is today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export function getTodayDayName():
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday' {
  const map = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ] as const;
  return map[new Date().getDay()];
}

export function formatTime12h(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = Number(hStr);
  if (Number.isNaN(h)) return time24;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${mStr} ${suffix}`;
}
