import { useState } from 'react';
import {
  Check,
  Clock,
  Plus,
  Trash2,
  Youtube,
  X,
} from 'lucide-react';
import { DAYS_OF_WEEK } from '../data/defaults';
import { DayOfWeek, Subject, TimetableSlot } from '../types/study';
import { formatTime12h, getSubjectYouTubeUrl, getTodayDayName } from '../utils/youtube';

interface TimetableViewProps {
  subjects: Subject[];
  timetable: TimetableSlot[];
  onAddSlot: (slot: Omit<TimetableSlot, 'id' | 'completed'>) => void;
  onToggleSlotComplete: (slotId: string) => void;
  onDeleteSlot: (slotId: string) => void;
  onStartFocusForSubject: (subjectId: string) => void;
}

export function TimetableView({
  subjects,
  timetable,
  onAddSlot,
  onToggleSlotComplete,
  onDeleteSlot,
  onStartFocusForSubject,
}: TimetableViewProps) {
  const todayName = getTodayDayName();
  const [selectedDay, setSelectedDay] = useState<'All' | DayOfWeek>('All');
  const [showForm, setShowForm] = useState(false);

  const [day, setDay] = useState<DayOfWeek>(todayName);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [topicFocus, setTopicFocus] = useState('');
  const [formError, setFormError] = useState('');

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (startTime >= endTime) {
      setFormError('End time must be after start time.');
      return;
    }
    setFormError('');
    onAddSlot({
      day,
      startTime,
      endTime,
      subjectId: subjectId || subjects[0]?.id || '',
      topicFocus: topicFocus.trim(),
    });
    setTopicFocus('');
    setShowForm(false);
  };

  const visibleDays = selectedDay === 'All' ? DAYS_OF_WEEK : [selectedDay];
  const totalSlots = timetable.length;
  const completedSlots = timetable.filter((s) => s.completed).length;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2616]">
            Weekly Timetable Planner
          </h1>
          <p className="text-sm text-[#6B4C35]">
            <span className="font-mono-tabular font-semibold text-[#4A6B22]">
              {completedSlots}/{totalSlots}
            </span>{' '}
            study blocks completed this week · Organize each day and jump straight to YouTube lessons.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4A6B22] hover:bg-[#3D591B] text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? 'Close Form' : 'Add Study Slot'}</span>
        </button>
      </div>

      {/* Add Study Slot Form */}
      {showForm && (
        <form
          onSubmit={handleCreateSlot}
          className="rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#3B2616]">
              New Study Block
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="slot-day" className="block text-xs font-medium text-[#6B4C35]">
                Day of Week
              </label>
              <select
                id="slot-day"
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm text-[#3B2616] focus:outline-none focus:border-[#4A6B22]"
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slot-start" className="block text-xs font-medium text-[#6B4C35]">
                Start Time
              </label>
              <input
                id="slot-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm font-mono-tabular text-[#3B2616] focus:outline-none focus:border-[#4A6B22]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slot-end" className="block text-xs font-medium text-[#6B4C35]">
                End Time
              </label>
              <input
                id="slot-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm font-mono-tabular text-[#3B2616] focus:outline-none focus:border-[#4A6B22]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slot-subject" className="block text-xs font-medium text-[#6B4C35]">
                Subject
              </label>
              <select
                id="slot-subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm text-[#3B2616] focus:outline-none focus:border-[#4A6B22]"
              >
                {subjects.length === 0 && <option value="">General Study</option>}
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slot-topic" className="block text-xs font-medium text-[#6B4C35]">
                Topic / Chapter Note
              </label>
              <input
                id="slot-topic"
                type="text"
                value={topicFocus}
                onChange={(e) => setTopicFocus(e.target.value)}
                placeholder="e.g., Chapter 3 exercises"
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm text-[#3B2616] placeholder:text-[#8C735D] focus:outline-none focus:border-[#4A6B22]"
              />
            </div>
          </div>

          {formError && (
            <p className="text-xs font-medium text-[#A63A2B]">{formError}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-[#CED7BA] text-sm font-medium text-[#5C3D24] hover:bg-[#EFF4E3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#5C3D24] hover:bg-[#472F1B] text-white text-sm font-medium transition-colors"
            >
              Save to Timetable
            </button>
          </div>
        </form>
      )}

      {/* Day Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#EFF4E3] border border-[#DCE3CC] overflow-x-auto">
        <button
          type="button"
          onClick={() => setSelectedDay('All')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            selectedDay === 'All'
              ? 'bg-[#FFFFFF] text-[#3B2616] shadow-xs'
              : 'text-[#6B4C35] hover:text-[#3B2616]'
          }`}
        >
          All Week
        </button>
        {DAYS_OF_WEEK.map((d) => {
          const isToday = d === todayName;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDay(d)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedDay === d
                  ? 'bg-[#FFFFFF] text-[#3B2616] shadow-xs'
                  : 'text-[#6B4C35] hover:text-[#3B2616]'
              }`}
            >
              {d.slice(0, 3)}
              {isToday ? ' (Today)' : ''}
            </button>
          );
        })}
      </div>

      {/* Timetable Grid / Day Cards */}
      <div
        className={
          selectedDay === 'All'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
            : 'space-y-4'
        }
      >
        {visibleDays.map((dayName) => {
          const daySlots = timetable
            .filter((s) => s.day === dayName)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          const isToday = dayName === todayName;

          return (
            <section
              key={dayName}
              className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 ${
                isToday
                  ? 'bg-[#FFFFFF] border-[#4A6B22]'
                  : 'bg-[#FFFFFF] border-[#DCE3CC]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EAEFDE]">
                  <div>
                    <h2 className="font-display text-base font-bold text-[#3B2616]">
                      {dayName}
                    </h2>
                    <div className="text-xs text-[#6B4C35]">
                      {isToday ? 'Today · ' : ''}
                      <span className="font-mono-tabular">
                        {daySlots.length} {daySlots.length === 1 ? 'block' : 'blocks'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDay(dayName);
                      setShowForm(true);
                    }}
                    aria-label={`Add study block on ${dayName}`}
                    className="p-2 rounded-lg bg-[#EFF4E3] hover:bg-[#E1EAD0] text-[#4A6B22] transition-colors"
                    title={`Add block for ${dayName}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {daySlots.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#8C735D]">
                    Rest day or unscheduled. Click + to add a block.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {daySlots.map((slot) => {
                      const subj = subjectMap.get(slot.subjectId);
                      const ytUrl = getSubjectYouTubeUrl(subj, slot.topicFocus);

                      return (
                        <div
                          key={slot.id}
                          className={`rounded-xl border p-3.5 space-y-2.5 transition-colors ${
                            slot.completed
                              ? 'bg-[#F8FAF2] border-[#E5ECD7]'
                              : 'bg-[#FBFDF7] border-[#DCE3CC]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <button
                                type="button"
                                onClick={() => onToggleSlotComplete(slot.id)}
                                aria-label={
                                  slot.completed ? 'Mark incomplete' : 'Mark complete'
                                }
                                className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  slot.completed
                                    ? 'bg-[#4A6B22] border-[#4A6B22] text-white'
                                    : 'border-[#BFC9AA] bg-white hover:border-[#4A6B22]'
                                }`}
                              >
                                {slot.completed && <Check className="w-3 h-3" />}
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
                                <div className="font-mono-tabular text-xs text-[#6B4C35]">
                                  {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => onDeleteSlot(slot.id)}
                              aria-label="Delete study slot"
                              className="p-1 rounded text-[#8C735D] hover:text-[#A63A2B] hover:bg-[#F5E9E6] transition-colors shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {slot.topicFocus && (
                            <p className="text-xs text-[#5C3D24] pl-7 leading-relaxed">
                              {slot.topicFocus}
                            </p>
                          )}

                          <div className="pl-7 flex flex-wrap items-center gap-2 pt-0.5">
                            <a
                              href={ytUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#CED7BA] bg-white hover:bg-[#EFF4E3] text-xs font-medium text-[#5C3D24] transition-colors whitespace-nowrap"
                            >
                              <Youtube className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Learn via YouTube</span>
                            </a>

                            {subj && (
                              <button
                                type="button"
                                onClick={() => onStartFocusForSubject(subj.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EFF4E3] hover:bg-[#E1EAD0] text-xs font-medium text-[#4A6B22] transition-colors whitespace-nowrap"
                              >
                                <Clock className="w-3 h-3" aria-hidden="true" />
                                <span>Focus</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
