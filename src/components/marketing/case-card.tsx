import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const APPLICATION_IMAGES: Record<string, string> = {
  porto: "/images/tombador-pili.jpg",
  cooperativa: "/images/tombador-pili.jpg",
  industria: "/images/tombador-pili.jpg",
  fertilizante: "/images/tombador-pili.jpg",
  cimento: "/images/tombador-pili.jpg",
};

interface CaseCardProps {
  title: string;
  slug: string;
  client: string;
  location: string;
  year: number;
  application?: string;
  image?: string;
  metrics?: { label: string; value: string }[];
}

export function CaseCard({
  title,
  slug,
  client,
  location,
  year,
  application,
  image,
  metrics,
}: CaseCardProps) {
  const fallbackImage = application ? APPLICATION_IMAGES[application] : undefined;
  const displayImage = image || fallbackImage;

  return (
    <Link
      href={`/obras/${slug}`}
      className="group relative flex flex-col overflow-hidden border border-pili-mist bg-pili-white transition-all hover:border-pili-black"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-pili-paper">
        {displayImage ? (
          <>
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pili-black/60 to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-pili-steel">
            <span className="font-display text-lg font-bold uppercase text-pili-cement">
              {client}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-pili-black px-3 py-1.5">
          <span className="font-mono text-xs text-pili-safety">{year}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-pili-cement">
          {client} &middot; {location}
        </div>
        <h3 className="mt-1 font-display text-lg font-bold uppercase leading-tight text-pili-black">
          {title}
        </h3>

        {metrics && metrics.length > 0 && (
          <div className="mt-3 flex gap-4">
            {metrics.slice(0, 2).map((m) => (
              <div key={m.label}>
                <span className="font-mono text-lg font-bold text-pili-black">
                  {m.value}
                </span>
                <span className="ml-1 font-mono text-[10px] uppercase tracking-wider text-pili-cement">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pili-black transition-colors group-hover:text-pili-safety-deep">
            Ver caso
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
