const CLIENTS = [
  "Cargill",
  "JBS Fertilizantes",
  "Cofco",
  "BRF",
  "Cooperativa Agraria",
  "Louis Dreyfus",
  "Bunge",
  "ADM",
] as const;

export function ClientsBand() {
  return (
    <section className="border-y border-pili-mist bg-pili-paper py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-pili-cement">
          Quem confia na PILI
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-8">
          {CLIENTS.map((client) => (
            <div
              key={client}
              className="flex items-center justify-center opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-pili-iron">
                {client}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
