"use client";

import { STATS } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";

interface Stat {
  value: string | number;
  label: string;
  suffix?: string;
}

interface StatsBandProps {
  stats?: Stat[];
}

const DEFAULT_STATS: Stat[] = [
  { value: `${STATS.years}`, label: "anos de mercado", suffix: "+" },
  { value: STATS.equipment, label: "equipamentos instalados" },
  { value: `${STATS.countries}`, label: "países atendidos" },
  { value: STATS.maxCapacity, label: "capacidade máxima" },
];

export function StatsBand({ stats = DEFAULT_STATS }: StatsBandProps) {
  return (
    <section className="relative bg-pili-black py-20 border-b-[3px] border-b-pili-safety">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat, index) => (
          <AnimateOnScroll key={stat.label} delay={index * 0.15}>
            <div className="text-center">
              <AnimatedCounter
                value={String(stat.value)}
                className="font-display text-5xl font-black text-pili-safety lg:text-7xl"
              />
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-pili-cement">
                {stat.label}
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
