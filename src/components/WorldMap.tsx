import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';
import topo from 'world-atlas/countries-110m.json';
import { NATIONS } from '../data';
import type { NationId, NationState } from '../engine/types';

const W = 960;
const H = 430; // the view cuts off below about 55°S, so Antarctica is not shown
const projection = geoNaturalEarth1().fitSize([W, 500], { type: 'Sphere' });
const path = geoPath(projection);

const world = feature(topo as never, (topo as never as { objects: { countries: never } }).objects.countries) as unknown as FeatureCollection<Geometry>;
const OWNER = new Map<string, NationId>(NATIONS.flatMap((n) => n.iso.map((iso) => [iso, n.id] as [string, NationId])));
const COUNTRIES = world.features
  .filter((f) => String(f.id) !== '010')
  .map((f) => ({ id: String(f.id), d: path(f) ?? '', owner: OWNER.get(String(f.id)) }));
const SPHERE = path({ type: 'Sphere' }) ?? '';

// Silver road: Spain -> Mexico -> Manila -> Silver Dragon (the Manila ships).
const ROUTE = [
  [[-6, 37], [-35, 24], [-80, 22], [-99.9, 16.8], [-140, 12], [-179.9, 13]],
  [[179.9, 13], [121, 14.6], [114, 23]],
].map((coordinates) => path({ type: 'LineString', coordinates }) ?? '');

/** Where each land's name sits next to its picture badge. */
const NAME: Record<NationId, { dx: number; dy: number; anchor: 'middle' | 'start' | 'end' }> = {
  rome: { dx: 6, dy: 40, anchor: 'middle' },
  spain: { dx: -8, dy: -28, anchor: 'middle' },
  khan: { dx: 0, dy: -28, anchor: 'middle' },
  dragon: { dx: 0, dy: 40, anchor: 'middle' },
  calm: { dx: 26, dy: 6, anchor: 'start' },
  usa: { dx: 0, dy: 40, anchor: 'middle' },
};

/** Ring colour and face show how strong each money is against Arti-Coin. */
const health = (ac: number) => (ac >= 100 ? '#16a34a' : ac >= 60 ? '#f59e0b' : '#dc2626');
const mood = (ac: number) => (ac >= 100 ? '😀' : ac >= 60 ? '😐' : '😟');
const MEDALS = ['🥇', '🥈', '🥉'];

interface Props {
  states?: Record<NationId, NationState>;
  playerId?: NationId | null;
  selected?: NationId | null;
  allowed?: NationId[];
  onSelect?: (id: NationId) => void;
  className?: string;
  /** Show only the northern band where the six lands are (bigger labels in the game frame). */
  crop?: boolean;
  /** Show medals for the three strongest moneys. */
  medals?: boolean;
}

export function WorldMap({ states, playerId, selected, allowed, onSelect, className, crop, medals }: Props) {
  const order = states ? [...NATIONS].sort((a, b) => states[b.id].acValue - states[a.id].acValue).map((n) => n.id) : [];
  const top = crop ? 48 : 0;
  const height = crop ? 262 : H;
  return (
    <svg viewBox={`0 ${top} ${W} ${height}`} className={className} role="img" aria-label="Map of Time World">
      <rect y={top} width={W} height={height} fill="#8fd3f4" />
      <path d={SPHERE} fill="#aee2fb" />
      {COUNTRIES.map((c) => {
        const def = c.owner && NATIONS.find((n) => n.id === c.owner);
        return <path key={c.id} d={c.d} fill={def ? def.color : '#c9e7a4'} stroke={def ? '#3b2f2f' : '#b4d98c'} strokeWidth={def ? 1.5 : 0.6} />;
      })}
      {ROUTE.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="2 8" strokeLinecap="round" />
      ))}
      {NATIONS.map((n) => {
        const [x, y] = projection([n.lon, n.lat]) ?? [0, 0];
        const pos = NAME[n.id];
        const s = states?.[n.id];
        const isPlayer = n.id === playerId;
        const isOn = isPlayer || n.id === selected;
        const off = allowed && !allowed.includes(n.id);
        const r = isOn ? 23 : 19;
        const medal = medals ? MEDALS[order.indexOf(n.id)] : undefined;
        return (
          <g key={n.id} opacity={off ? 0.35 : 1} onClick={() => !off && onSelect?.(n.id)} style={{ cursor: onSelect && !off ? 'pointer' : 'default' }}>
            {isOn && <circle cx={x} cy={y} r={12} fill="none" stroke="#f59e0b" strokeWidth={5} className="pulse-ring" />}
            <circle cx={x} cy={y} r={r} fill={isOn ? '#fde68a' : '#fff'} stroke={s ? health(s.acValue) : '#3b2f2f'} strokeWidth={isOn ? 5 : 3.5} />
            <text x={x} y={y + (isOn ? 10 : 8)} textAnchor="middle" fontSize={isOn ? 28 : 23}>{n.icon}</text>
            <text x={x + pos.dx} y={y + pos.dy} textAnchor={pos.anchor} fontSize={17} fontWeight={900} fill="#3b2f2f" stroke="#fff" strokeWidth={5} paintOrder="stroke" strokeLinejoin="round">
              {n.name}{isPlayer ? ' ⭐' : ''}
            </text>
            {s && <text x={x + r - 4} y={y - r + 8} fontSize={19}>{mood(s.acValue)}</text>}
            {medal && <text x={x - r - 10} y={y + r} fontSize={24}>{medal}</text>}
          </g>
        );
      })}
      {!crop && (
        <g transform={`translate(${W / 2 - 160}, ${H - 38})`}>
          <rect width={320} height={32} rx={16} fill="#fff" stroke="#3b2f2f" strokeWidth={2} />
          <text x={160} y={22} textAnchor="middle" fontSize={16} fontWeight={800} fill="#3b2f2f">🪙 All lands trade with Arti-Coin</text>
        </g>
      )}
    </svg>
  );
}
