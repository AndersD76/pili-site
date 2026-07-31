import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid-pattern relative flex min-h-screen flex-col items-center justify-center bg-pili-black px-4 text-center">
      <p className="font-display text-[clamp(6rem,20vw,14rem)] font-black leading-none text-pili-safety">
        404
      </p>

      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-pili-white sm:text-3xl">
        Página não encontrada
      </h1>

      <p className="mt-3 max-w-md text-base text-pili-cement">
        A página que você procura não existe ou foi movida.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-pili-safety px-6 py-3 text-sm font-semibold text-pili-white transition-colors hover:bg-pili-safety-bright"
      >
        Voltar ao início
      </Link>

      <div className="mt-16">
        <img
          src="/images/logo-pili-white.png"
          alt="PILI"
          className="h-8 opacity-40"
        />
      </div>
    </div>
  );
}
