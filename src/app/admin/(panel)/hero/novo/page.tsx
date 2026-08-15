import { requireRole } from "@/lib/auth-guard";
import { HeroSlideForm, SLIDE_VAZIO } from "@/components/admin/hero-slide-form";

export const metadata = { title: "Novo slide" };

export default async function NovoHeroSlidePage() {
  await requireRole("ADMIN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-pili-black">
          Novo slide
        </h1>
        <p className="mt-1 text-sm text-pili-concrete">
          Defina os títulos primeiro. O envio da imagem de fundo aparece logo
          depois de criar o slide.
        </p>
      </div>

      <HeroSlideForm initial={SLIDE_VAZIO} />
    </div>
  );
}
