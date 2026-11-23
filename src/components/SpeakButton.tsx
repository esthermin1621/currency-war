import { speak } from '../lib/speech';

export function SpeakButton({ text, small }: { text: string; small?: boolean }) {
  return (
    <button
      aria-label="Read it to me"
      title="Read it to me"
      onClick={(e) => { e.stopPropagation(); speak(text); }}
      className={`no-print shrink-0 rounded-full border-[3px] border-ink bg-white ${small ? 'h-11 w-11 text-xl' : 'h-16 w-16 text-3xl'}`}
    >
      🔊
    </button>
  );
}
