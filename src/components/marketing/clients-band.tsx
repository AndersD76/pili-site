import { AnimateOnScroll } from "@/components/shared/animate-on-scroll";

const CLIENTS = [
  "Cargill",
  "JBS",
  "Cofco",
  "BRF",
  "Agraria",
  "Louis Dreyfus",
  "Bunge",
  "ADM",
  "Cooperativa Lar",
  "Yara",
  "Votorantim",
  "Coamo",
] as const;

export function ClientsBand() {
  return (
    <section className="border-y border-pili-mist bg-pili-white py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-pili-mist" />
            <h2 className="text-center font-mono text-xs font-semibold uppercase tracking-[0.3em] text-pili-cement">
              Quem confia na PILI
            </h2>
            <div className="h-px flex-1 bg-pili-mist" />
          </div>
        </AnimateOnScroll>
        <div className="mt-12 grid grid-cols-3 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-6">
          {CLIENTS.map((client, i) => (
            <AnimateOnScroll key={client} delay={i * 0.05}>
              <div className="group flex flex-col items-center justify-center">
                <div className="flex h-16 w-full items-center justify-center border border-pili-mist bg-pili-paper px-4 transition-all group-hover:border-pili-black group-hover:bg-pili-white">
                  <span className="font-display text-sm font-bold uppercase tracking-wider text-pili-concrete transition-colors group-hover:text-pili-black">
                    {client}
                  </span>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
