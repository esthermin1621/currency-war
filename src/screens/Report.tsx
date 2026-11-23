import { NATIONS, nationDef } from '../data';
import { LineChart } from '../components/LineChart';
import { OTHER_NEWS } from '../lib/text';
import { useGame } from '../store/game';

export function Ranking() {
  const game = useGame((s) => s.game)!;
  const rows = NATIONS.map((n) => ({ n, s: game.world.nations[n.id] })).sort((a, b) => b.s.acValue - a.s.acValue);
  const max = Math.max(...rows.map((r) => r.s.acValue), 100);
  return (
    <ol className="flex flex-col gap-1 text-[16px] font-bold">
      {rows.map(({ n, s }, i) => (
        <li key={n.id} className={`flex items-center gap-2 rounded-xl px-2 py-0.5 ${n.id === game.world.playerId ? 'bg-amber-200 ring-2 ring-ink' : ''}`}>
          <span className="w-5">{i + 1}</span>
          <span className="w-36 shrink-0 truncate text-left">{n.icon} {n.name}</span>
          <span className="h-4 min-w-8 flex-1 overflow-hidden rounded-full bg-ink/10">
            <span className="block h-full rounded-full" style={{ width: `${(s.acValue / max) * 100}%`, background: n.color }} />
          </span>
          <span className="shrink-0 whitespace-nowrap text-right text-[13px] tabular-nums">🪙1 = {((n.acRate * 100) / s.acValue).toFixed(1)} {n.currency}</span>
        </li>
      ))}
    </ol>
  );
}

export function Report() {
  const { game, nextYear } = useGame();
  const g = game!;
  const done = g.world.year > g.world.options.turns;
  const other = NATIONS.filter((n) => n.id !== g.world.playerId)
    .map((n) => ({ n, p: g.last!.others[n.id] }))
    .sort((a, b) => rank(a.p) - rank(b.p))[0];
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
        <div>
          <h3 className="text-xl font-black">📈 Your bread price</h3>
          <LineChart values={[10, ...g.log.map((r) => r.breadPrice)]} />
        </div>
        <div>
          <h3 className="text-xl font-black">🏆 Strongest money</h3>
          <Ranking />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-2xl border-2 border-ink/60 bg-white px-3 py-1.5 text-[18px] font-bold">
          🗞️ News from {nationDef(other.n.id).name}: {OTHER_NEWS[other.p]}
        </div>
        <button className="btn btn-green" onClick={nextYear}>{done ? 'See the End 🏁' : 'Next Year ➡'}</button>
      </div>
    </div>
  );
}

const rank = (p: string) => ['hyperinflation', 'stagflation', 'deflation', 'inflation', 'mild', 'stable'].indexOf(p);
