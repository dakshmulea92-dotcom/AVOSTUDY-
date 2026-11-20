import { useState } from 'react';
import {
  Check,
  Clock,
  ExternalLink,
  Plus,
  Search,
  Trash2,
  X,
  Youtube,
} from 'lucide-react';
import { Subject, SubjectPriority } from '../types/study';
import { formatExamCountdown, getSubjectYouTubeUrl } from '../utils/youtube';

interface SubjectsViewProps {
  subjects: Subject[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onDeleteSubject: (subjectId: string) => void;
  onToggleTopic: (subjectId: string, topicId: string) => void;
  onAddTopic: (subjectId: string, topicTitle: string) => void;
  onDeleteTopic: (subjectId: string, topicId: string) => void;
  onStartFocusForSubject: (subjectId: string) => void;
}

export function SubjectsView({
  subjects,
  onAddSubject,
  onDeleteSubject,
  onToggleTopic,
  onAddTopic,
  onDeleteTopic,
  onStartFocusForSubject,
}: SubjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | SubjectPriority>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add Subject form state
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [priority, setPriority] = useState<SubjectPriority>('High');
  const [youtubeQuery, setYoutubeQuery] = useState('');
  const [topicsInput, setTopicsInput] = useState('');

  // Per-subject inline topic input state
  const [newTopicText, setNewTopicText] = useState<Record<string, string>>({});

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const initialTopics = topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((title, index) => ({
        id: `topic-${Date.now()}-${index}`,
        title,
        completed: false,
      }));

    onAddSubject({
      name: trimmedName,
      examDate,
      priority,
      youtubeQuery: youtubeQuery.trim() || `${trimmedName} exam lecture`,
      topics: initialTopics,
    });

    setName('');
    setYoutubeQuery('');
    setTopicsInput('');
    setShowAddForm(false);
  };

  const handleAddInlineTopic = (subjectId: string, e: React.FormEvent) => {
    e.preventDefault();
    const val = (newTopicText[subjectId] || '').trim();
    if (!val) return;
    onAddTopic(subjectId, val);
    setNewTopicText((prev) => ({ ...prev, [subjectId]: '' }));
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topics.some((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'All' || s.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2616]">
            Subject Addition List
          </h1>
          <p className="text-sm text-[#6B4C35]">
            Add your exam subjects, check off syllabus chapters, and launch YouTube video lessons per subject.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4A6B22] hover:bg-[#3D591B] text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? 'Close Form' : 'Add Subject'}</span>
        </button>
      </div>

      {/* Add Subject Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateSubject}
          className="rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-6 space-y-4"
        >
          <h2 className="font-display text-base font-semibold text-[#3B2616]">
            Add New Exam Subject
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="subj-name" className="block text-xs font-medium text-[#6B4C35]">
                Subject Name
              </label>
              <input
                id="subj-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Organic Chemistry"
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm text-[#3B2616] placeholder:text-[#8C735D] focus:outline-none focus:border-[#4A6B22]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subj-date" className="block text-xs font-medium text-[#6B4C35]">
                Exam Date
              </label>
              <input
                id="subj-date"
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm font-mono-tabular text-[#3B2616] focus:outline-none focus:border-[#4A6B22]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subj-priority" className="block text-xs font-medium text-[#6B4C35]">
                Priority Level
              </label>
              <select
                id="subj-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as SubjectPriority)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm text-[#3B2616] focus:outline-none focus:border-[#4A6B22]"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subj-yt" className="block text-xs font-medium text-[#6B4C35]">
                YouTube Search or Playlist URL
              </label>
              <input
                id="subj-yt"
                type="text"
                value={youtubeQuery}
                onChange={(e) => setYoutubeQuery(e.target.value)}
                placeholder="e.g., Organic Chemistry crash course"
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm text-[#3B2616] placeholder:text-[#8C735D] focus:outline-none focus:border-[#4A6B22]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subj-topics" className="block text-xs font-medium text-[#6B4C35]">
              Initial Syllabus Topics (comma-separated, optional)
            </label>
            <input
              id="subj-topics"
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder="e.g., Alkanes & Stereochemistry, Reaction Mechanisms, Spectroscopy"
              className="w-full px-3 py-2 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm text-[#3B2616] placeholder:text-[#8C735D] focus:outline-none focus:border-[#4A6B22]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg border border-[#CED7BA] text-sm font-medium text-[#5C3D24] hover:bg-[#EFF4E3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#5C3D24] hover:bg-[#472F1B] text-white text-sm font-medium transition-colors"
            >
              Save Subject
            </button>
          </div>
        </form>
      )}

      {/* Search and Priority Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="w-4 h-4 text-[#8C735D] absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects or topics..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#DCE3CC] text-sm text-[#3B2616] placeholder:text-[#8C735D] focus:outline-none focus:border-[#4A6B22]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#EFF4E3] border border-[#DCE3CC] self-start sm:self-auto">
          {(['All', 'High', 'Medium', 'Low'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setPriorityFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                priorityFilter === level
                  ? 'bg-white text-[#3B2616] shadow-xs'
                  : 'text-[#6B4C35] hover:text-[#3B2616]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects List */}
      {filteredSubjects.length === 0 ? (
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-10 text-center space-y-3">
          <p className="text-sm text-[#6B4C35]">
            {subjects.length === 0
              ? 'No subjects added yet. Add your first exam subject to track chapters and YouTube lessons.'
              : 'No subjects match your current search or priority filter.'}
          </p>
          {subjects.length === 0 && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-xl bg-[#4A6B22] hover:bg-[#3D591B] text-white text-sm font-medium transition-colors"
            >
              Add First Subject
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredSubjects.map((subject) => {
            const doneCount = subject.topics.filter((t) => t.completed).length;
            const totalCount = subject.topics.length;
            const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

            return (
              <article
                key={subject.id}
                className="rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  {/* Top Title & Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h2 className="font-display text-xl font-bold text-[#3B2616] truncate">
                        {subject.name}
                      </h2>
                      <div className="text-xs text-[#6B4C35] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-semibold text-[#5C3D24]">
                          {subject.priority} Priority
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">
                          {formatExamCountdown(subject.examDate)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">
                          {doneCount}/{totalCount} topics
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteSubject(subject.id)}
                      aria-label={`Delete ${subject.name}`}
                      className="p-2 rounded-lg text-[#8C735D] hover:text-[#A63A2B] hover:bg-[#F5E9E6] transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B4C35]">Syllabus completion</span>
                      <span className="font-mono-tabular font-semibold text-[#4A6B22]">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#EFF4E3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#4A6B22] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Syllabus Topics Checklist */}
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-semibold text-[#5C3D24]">
                      Topics Checklist
                    </div>

                    {subject.topics.length === 0 ? (
                      <p className="text-xs text-[#8C735D] py-1">
                        No topics yet. Add a chapter below.
                      </p>
                    ) : (
                      <ul className="divide-y divide-[#F0F4E6]">
                        {subject.topics.map((topic) => (
                          <li
                            key={topic.id}
                            className="py-2 flex items-center justify-between gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => onToggleTopic(subject.id, topic.id)}
                              className="flex items-center gap-2.5 text-left min-w-0 flex-1 group"
                            >
                              <span
                                className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                  topic.completed
                                    ? 'bg-[#4A6B22] border-[#4A6B22] text-white'
                                    : 'border-[#BFC9AA] bg-white group-hover:border-[#4A6B22]'
                                }`}
                              >
                                {topic.completed && <Check className="w-3 h-3" />}
                              </span>
                              <span
                                className={`text-sm truncate ${
                                  topic.completed
                                    ? 'line-through text-[#8C735D]'
                                    : 'text-[#3B2616]'
                                }`}
                              >
                                {topic.title}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteTopic(subject.id, topic.id)}
                              aria-label={`Remove ${topic.title}`}
                              className="p-1 rounded text-[#9A826C] hover:text-[#A63A2B] transition-colors shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Inline Add Topic */}
                    <form
                      onSubmit={(e) => handleAddInlineTopic(subject.id, e)}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={newTopicText[subject.id] || ''}
                        onChange={(e) =>
                          setNewTopicText((prev) => ({
                            ...prev,
                            [subject.id]: e.target.value,
                          }))
                        }
                        placeholder="Add chapter or topic..."
                        aria-label={`Add topic to ${subject.name}`}
                        className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-[#F8FAF2] border border-[#DCE3CC] text-xs text-[#3B2616] placeholder:text-[#8C735D] focus:outline-none focus:border-[#4A6B22]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-[#EFF4E3] hover:bg-[#E1EAD0] text-xs font-semibold text-[#4A6B22] transition-colors whitespace-nowrap shrink-0"
                      >
                        Add
                      </button>
                    </form>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-[#EAEFDE] flex flex-wrap items-center justify-between gap-2.5">
                  <a
                    href={getSubjectYouTubeUrl(subject)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5C3D24] hover:bg-[#472F1B] text-white text-xs font-medium transition-colors whitespace-nowrap"
                  >
                    <Youtube className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Learn via YouTube</span>
                    <ExternalLink className="w-3 h-3 opacity-80 shrink-0" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onStartFocusForSubject(subject.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#CED7BA] bg-[#F8FAF2] hover:bg-[#EFF4E3] text-xs font-semibold text-[#4A6B22] transition-colors whitespace-nowrap"
                  >
                    <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Start Focus Timer</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
