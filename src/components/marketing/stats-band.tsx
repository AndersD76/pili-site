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
    <section className="bg-pili-black border-t border-pili-iron py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-display text-4xl font-black text-pili-safety lg:text-5xl">
              {stat.value}
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-widest text-pili-cement">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
