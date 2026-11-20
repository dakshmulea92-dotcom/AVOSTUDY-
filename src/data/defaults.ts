import { DayOfWeek, Subject, TimetableSlot } from '../types/study';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function offsetDateFromToday(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createStarterSubjects(): Subject[] {
  return [
    {
      id: 'subj-math',
      name: 'Calculus & Linear Algebra',
      examDate: offsetDateFromToday(11),
      priority: 'High',
      youtubeQuery: 'Calculus integration and eigenvalues full lecture',
      notes: 'Focus on past paper integration problems and matrix diagonalization.',
      topics: [
        { id: 't-m1', title: 'Limits & Continuity Review', completed: true },
        { id: 't-m2', title: 'Integration by Parts & Substitution', completed: true },
        { id: 't-m3', title: 'Differential Equations', completed: false },
        { id: 't-m4', title: 'Eigenvalues & Eigenvectors', completed: false },
        { id: 't-m5', title: 'Timed Mock Exam Paper', completed: false },
      ],
    },
    {
      id: 'subj-bio',
      name: 'Cell Biology & Genetics',
      examDate: offsetDateFromToday(16),
      priority: 'Medium',
      youtubeQuery: 'Cellular respiration mitosis and genetics crash course',
      notes: 'Draw pathway diagrams from memory before checking textbook.',
      topics: [
        { id: 't-b1', title: 'Membrane Transport & Osmosis', completed: true },
        { id: 't-b2', title: 'Cellular Respiration & ATP Cycle', completed: false },
        { id: 't-b3', title: 'DNA Replication & Transcription', completed: false },
        { id: 't-b4', title: 'Mendelian Inheritance Practice', completed: false },
      ],
    },
    {
      id: 'subj-cs',
      name: 'Data Structures & Algorithms',
      examDate: offsetDateFromToday(22),
      priority: 'High',
      youtubeQuery: 'Graph algorithms dynamic programming exam review',
      notes: 'Trace BFS, DFS, and Dijkstra step-by-step on paper.',
      topics: [
        { id: 't-c1', title: 'Trees & Binary Search Trees', completed: true },
        { id: 't-c2', title: 'Graph Traversals (BFS & DFS)', completed: true },
        { id: 't-c3', title: 'Shortest Path & Minimum Spanning Tree', completed: false },
        { id: 't-c4', title: 'Dynamic Programming Patterns', completed: false },
      ],
    },
    {
      id: 'subj-econ',
      name: 'Macroeconomics Principles',
      examDate: offsetDateFromToday(28),
      priority: 'Low',
      youtubeQuery: 'Macroeconomics IS LM fiscal monetary policy lecture',
      notes: 'Practice sketching supply-demand shifts and inflation curves.',
      topics: [
        { id: 't-e1', title: 'GDP & Inflation Measurement', completed: true },
        { id: 't-e2', title: 'Monetary & Fiscal Policy', completed: false },
        { id: 't-e3', title: 'Aggregate Demand & Supply', completed: false },
      ],
    },
  ];
}

export function createStarterTimetable(): TimetableSlot[] {
  return [
    {
      id: 'slot-1',
      day: 'Monday',
      startTime: '08:30',
      endTime: '10:00',
      subjectId: 'subj-math',
      topicFocus: 'Differential Equations practice set',
      completed: true,
    },
    {
      id: 'slot-2',
      day: 'Monday',
      startTime: '16:00',
      endTime: '17:30',
      subjectId: 'subj-cs',
      topicFocus: 'Graph BFS & DFS dry-run exercises',
      completed: false,
    },
    {
      id: 'slot-3',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '10:30',
      subjectId: 'subj-bio',
      topicFocus: 'Cellular respiration diagram active recall',
      completed: false,
    },
    {
      id: 'slot-4',
      day: 'Wednesday',
      startTime: '14:00',
      endTime: '15:30',
      subjectId: 'subj-math',
      topicFocus: 'Eigenvalues & Eigenvectors problems',
      completed: false,
    },
    {
      id: 'slot-5',
      day: 'Thursday',
      startTime: '10:00',
      endTime: '11:30',
      subjectId: 'subj-cs',
      topicFocus: 'Dynamic programming memoization table',
      completed: false,
    },
    {
      id: 'slot-6',
      day: 'Friday',
      startTime: '15:00',
      endTime: '16:30',
      subjectId: 'subj-econ',
      topicFocus: 'Monetary policy essay outlines',
      completed: false,
    },
    {
      id: 'slot-7',
      day: 'Saturday',
      startTime: '09:30',
      endTime: '11:30',
      subjectId: 'subj-math',
      topicFocus: 'Timed 2-hour past paper simulation',
      completed: false,
    },
    {
      id: 'slot-8',
      day: 'Sunday',
      startTime: '17:00',
      endTime: '18:00',
      subjectId: 'subj-bio',
      topicFocus: 'Weekly flashcards & weak-topic review',
      completed: false,
    },
  ];
}
