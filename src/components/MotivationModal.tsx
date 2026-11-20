import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react';
import { MOTIVATION_QUOTES } from '../data/quotes';
import { AvocadoMark } from './AvocadoMark';

interface MotivationModalProps {
  isOpen: boolean;
  quoteIndex: number;
  dailyIntention: string;
  onChangeIntention: (value: string) => void;
  onNextQuote: () => void;
  onPrevQuote: () => void;
  onClose: () => void;
}

export function MotivationModal({
  isOpen,
  quoteIndex,
  dailyIntention,
  onChangeIntention,
  onNextQuote,
  onPrevQuote,
  onClose,
}: MotivationModalProps) {
  const [draftIntention, setDraftIntention] = useState(dailyIntention);

  useEffect(() => {
    setDraftIntention(dailyIntention);
  }, [dailyIntention, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quote = MOTIVATION_QUOTES[quoteIndex % MOTIVATION_QUOTES.length];
  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleSaveAndClose = () => {
    onChangeIntention(draftIntention.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1A0E]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="motivation-modal-title"
      onClick={handleSaveAndClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] border border-[#DCE3CC] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top banner in rich avocado peel green */}
        <div className="bg-[#4A6B22] text-white px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8FAF2] flex items-center justify-center shrink-0">
              <AvocadoMark className="w-6 h-6" />
            </div>
            <div>
              <h2
                id="motivation-modal-title"
                className="font-display text-lg font-bold leading-snug"
              >
                Daily Motivation
              </h2>
              <p className="text-xs text-[#E3EED0]">
                {todayFormatted} · Quote {quoteIndex + 1} of {MOTIVATION_QUOTES.length}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveAndClose}
            aria-label="Close daily motivation popup"
            className="p-2 rounded-lg text-white/85 hover:text-white hover:bg-white/15 transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <blockquote className="space-y-2">
            <p className="font-display text-2xl font-semibold text-[#3B2616] leading-snug text-balance">
              “{quote.text}”
            </p>
            <footer className="text-sm font-medium text-[#6B4C35]">
              — {quote.author}
            </footer>
          </blockquote>

          {/* Actionable study tip in soft avocado tint */}
          <div className="rounded-xl bg-[#EFF4E3] border border-[#DCE3CC] p-4 space-y-1">
            <div className="text-xs font-semibold text-[#4A6B22]">
              Study Action Tip
            </div>
            <p className="text-sm text-[#3B2616] leading-relaxed">
              {quote.focusTip}
            </p>
          </div>

          {/* Personal intention input */}
          <div className="space-y-1.5">
            <label
              htmlFor="daily-intention-input"
              className="block text-sm font-medium text-[#3B2616]"
            >
              Today’s Top Study Goal
            </label>
            <input
              id="daily-intention-input"
              type="text"
              value={draftIntention}
              onChange={(e) => setDraftIntention(e.target.value)}
              placeholder="e.g., Finish Chapter 4 practice problems"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#F8FAF2] border border-[#CED7BA] text-sm text-[#3B2616] placeholder:text-[#8C735D] focus:outline-none focus:border-[#4A6B22]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8EEDB]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrevQuote}
                aria-label="Previous quote"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#CED7BA] bg-white hover:bg-[#EFF4E3] text-sm font-medium text-[#5C3D24] transition-colors whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                onClick={onNextQuote}
                aria-label="Next quote"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#CED7BA] bg-white hover:bg-[#EFF4E3] text-sm font-medium text-[#5C3D24] transition-colors whitespace-nowrap"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="https://www.youtube.com/results?search_query=study+with+me+exam+motivation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#CED7BA] bg-[#F8FAF2] hover:bg-[#EFF4E3] text-sm font-medium text-[#5C3D24] transition-colors whitespace-nowrap"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleSaveAndClose}
                className="px-4 py-2 rounded-lg bg-[#5C3D24] hover:bg-[#472F1B] text-white text-sm font-medium transition-colors whitespace-nowrap"
              >
                Start Studying
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
