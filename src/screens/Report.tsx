import { NATIONS } from '../data';
import { useGame } from '../store/game';

export function Ranking() {
  const game = useGame((s) => s.game)!;
  const rows = NATIONS.map((n) => ({ n, s: game.world.nations[n.id] })).sort((a, b) => b.s.acValue - a.s.acValue);
  const max = Math.max(...rows.map((r) => r.s.acValue), 100);
  const face = (ac: number) => (ac >= 100 ? '😀' : ac >= 60 ? '😐' : '😟');
  return (
    <ol className="flex flex-col gap-1 text-[18px] font-bold">
      {rows.map(({ n, s }, i) => (
        <li key={n.id} className={`flex items-center gap-2 rounded-xl px-2 py-0.5 ${n.id === game.world.playerId ? 'bg-amber-200 ring-2 ring-ink' : ''}`}>
          <span className="w-8 text-center text-2xl">{['🥇', '🥈', '🥉'][i] ?? <span className="text-lg">{i + 1}</span>}</span>
          <span className="text-2xl">{n.icon}</span>
          <span className="w-36 shrink-0 truncate text-left">{n.name}</span>
          <span className="h-5 min-w-8 flex-1 overflow-hidden rounded-full border-2 border-ink/40 bg-white">
            <span className="block h-full rounded-full" style={{ width: `${(s.acValue / max) * 100}%`, background: n.color }} />
          </span>
          <span className="text-2xl">{face(s.acValue)}</span>
        </li>
      ))}
    </ol>
  );
}
