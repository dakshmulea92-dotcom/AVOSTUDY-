import { MotivationQuote } from '../types/study';

export const MOTIVATION_QUOTES: MotivationQuote[] = [
  {
    id: 'q1',
    text: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
    focusTip: 'Pick just one chapter from your subject list and give it 25 focused minutes right now.',
  },
  {
    id: 'q2',
    text: 'You do not have to be great to start, but you have to start to be great.',
    author: 'Zig Ziglar',
    focusTip: 'Start the timer before you feel ready. Momentum builds after the first five minutes.',
  },
  {
    id: 'q3',
    text: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
    focusTip: 'Break a daunting syllabus down into 3 small topics and check off the first one today.',
  },
  {
    id: 'q4',
    text: 'Quality is never an accident; it is always the result of intelligent effort.',
    author: 'John Ruskin',
    focusTip: 'Test yourself aloud after watching a lecture instead of passively re-reading notes.',
  },
  {
    id: 'q5',
    text: 'Discipline is choosing between what you want now and what you want most.',
    author: 'Abraham Lincoln',
    focusTip: 'Keep your phone in another room during your next focus block.',
  },
  {
    id: 'q6',
    text: 'It always seems impossible until it is done.',
    author: 'Nelson Mandela',
    focusTip: 'Review your toughest subject first while your mind is sharpest.',
  },
  {
    id: 'q7',
    text: 'Little by little, a little becomes a lot.',
    author: 'Tanzanian Proverb',
    focusTip: 'Two focused 25-minute sessions today are worth four distracted hours.',
  },
  {
    id: 'q8',
    text: 'Do not watch the clock; do what it does. Keep going.',
    author: 'Sam Levenson',
    focusTip: 'Let the focus timer handle the clock so you can stay immersed in the problem.',
  },
  {
    id: 'q9',
    text: 'Believe you can and you are halfway there.',
    author: 'Theodore Roosevelt',
    focusTip: 'Write down one concept you mastered yesterday to remind yourself how fast you learn.',
  },
  {
    id: 'q10',
    text: 'Future you is already grateful for the hours you put in today.',
    author: 'Study Notebook',
    focusTip: 'End each study block by writing the exact first question you will tackle next session.',
  },
  {
    id: 'q11',
    text: 'An investment in knowledge pays the best interest.',
    author: 'Benjamin Franklin',
    focusTip: 'Use active recall: close your book and sketch everything you remember on blank paper.',
  },
  {
    id: 'q12',
    text: 'Fall seven times, stand up eight.',
    author: 'Japanese Proverb',
    focusTip: 'Missed practice questions are the fastest map to what you need to review next.',
  },
  {
    id: 'q13',
    text: 'Consistency beats intensity when preparing for big exams.',
    author: 'Academic Principle',
    focusTip: 'Follow your timetable slots gently and protect your short breaks to avoid burnout.',
  },
  {
    id: 'q14',
    text: 'Clarity comes from engagement, not thought alone.',
    author: 'Marie Forleo',
    focusTip: 'Solve three practice problems right after reviewing the formula sheet.',
  },
  {
    id: 'q15',
    text: 'Rest is part of the work, not the opposite of it.',
    author: 'Study Principle',
    focusTip: 'Step away from your desk during your 5-minute break, stretch, and hydrate.',
  },
];

export function getDailyQuoteIndex(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i += 1) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) % 100000;
  }
  return hash % MOTIVATION_QUOTES.length;
}
