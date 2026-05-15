import { STATS } from "@/lib/constants";

interface Stat {
  value: string | number;
  label: string;
}

interface StatsBandProps {
  stats?: Stat[];
}

const DEFAULT_STATS: Stat[] = [
  { value: `${STATS.years}`, label: "anos" },
  { value: STATS.equipment, label: "equipamentos" },
  { value: `${STATS.countries}`, label: "paises" },
  { value: STATS.maxCapacity, label: "maxima" },
];

export function StatsBand({ stats = DEFAULT_STATS }: StatsBandProps) {
  return (
    <section
      className="relative bg-pili-black border-t border-pili-iron py-20 border-b-2 border-b-pili-safety/30"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.02) 20px, rgba(255,255,255,0.02) 21px)",
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-display text-5xl font-black text-pili-safety lg:text-6xl">
              {stat.value}
            </div>
            <div className="mt-3 font-mono text-xs uppercase tracking-widest text-pili-cement">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
