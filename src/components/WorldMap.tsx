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

const LABEL: Record<NationId, { dx: number; dy: number }> = {
  rome: { dx: 34, dy: 34 },
  spain: { dx: -40, dy: -30 },
  khan: { dx: -30, dy: -34 },
  dragon: { dx: -44, dy: 40 },
  calm: { dx: 62, dy: 6 },
  usa: { dx: 0, dy: 44 },
};

/** Ring colour shows how strong each money is against Arti-Coin. */
const health = (ac: number) => (ac >= 100 ? '#16a34a' : ac >= 60 ? '#f59e0b' : '#dc2626');
const mood = (ac: number) => (ac >= 100 ? '💪' : ac >= 60 ? '😐' : '😟');

interface Props {
  states?: Record<NationId, NationState>;
  playerId?: NationId | null;
  selected?: NationId | null;
  allowed?: NationId[];
  onSelect?: (id: NationId) => void;
  className?: string;
  /** Show only the northern band where the six lands are (bigger labels in the game frame). */
  crop?: boolean;
}

export function WorldMap({ states, playerId, selected, allowed, onSelect, className, crop }: Props) {
  const top = crop ? 48 : 0;
  const height = crop ? 262 : H;
  return (
    <svg viewBox={`0 ${top} ${W} ${height}`} className={className} role="img" aria-label="Map of Time World">
      <rect y={top} width={W} height={height} fill="#bfe3ee" />
      <path d={SPHERE} fill="#d5eef5" />
      {COUNTRIES.map((c) => {
        const def = c.owner && NATIONS.find((n) => n.id === c.owner);
        const active = def && (c.owner === playerId || c.owner === selected);
        return (
          <path
            key={c.id}
            d={c.d}
            fill={def ? def.color : '#f1e0b0'}
            fillOpacity={def ? (active ? 1 : 0.7) : 1}
            stroke={def ? '#3b2f2f' : '#c8b27a'}
            strokeWidth={def ? 1.2 : 0.5}
          />
        );
      })}
      {ROUTE.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#64748b" strokeWidth={2.5} strokeDasharray="3 7" strokeLinecap="round" />
      ))}
      {NATIONS.map((n) => {
        const [x, y] = projection([n.lon, n.lat]) ?? [0, 0];
        const { dx, dy } = LABEL[n.id];
        const s = states?.[n.id];
        const isPlayer = n.id === playerId;
        const isOn = isPlayer || n.id === selected;
        const off = allowed && !allowed.includes(n.id);
        const w = n.name.length * 10 + (isPlayer ? 20 : 0) + (s ? 64 : 38);
        return (
          <g
            key={n.id}
            opacity={off ? 0.35 : 1}
            onClick={() => !off && onSelect?.(n.id)}
            style={{ cursor: onSelect && !off ? 'pointer' : 'default' }}
          >
            <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke="#3b2f2f" strokeWidth={1.5} />
            {isOn && <circle cx={x} cy={y} r={12} fill="none" stroke="#f59e0b" strokeWidth={4} className="pulse-ring" />}
            <circle cx={x} cy={y} r={isOn ? 9 : 6.5} fill={s ? health(s.acValue) : '#fff'} stroke="#3b2f2f" strokeWidth={2} />
            <g transform={`translate(${x + dx - w / 2}, ${y + dy - 15})`}>
              <rect width={w} height={30} rx={15} fill={isOn ? '#fde68a' : '#fffdf5'} stroke="#3b2f2f" strokeWidth={isOn ? 3 : 1.5} />
              <text x={w / 2} y={21} textAnchor="middle" fontSize={16} fontWeight={800} fill="#3b2f2f">
                {n.icon} {n.name}{isPlayer ? ' ⭐' : ''}{s ? ` ${mood(s.acValue)}` : ''}
              </text>
            </g>
          </g>
        );
      })}
      <g transform={`translate(${crop ? 14 : W / 2 - 150}, ${top + height - 34})`}>
        <rect width={300} height={28} rx={14} fill="#fffdf5" stroke="#3b2f2f" strokeWidth={1.5} opacity={0.92} />
        <text x={150} y={19} textAnchor="middle" fontSize={14} fontWeight={700} fill="#3b2f2f">
          🪙 All lands trade with Arti-Coin
        </text>
      </g>
    </svg>
  );
}
