import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { WhatsAppFab } from "@/components/shared/whatsapp-fab";
import { PiliRobo } from "@/components/shared/pili-robo";
import { CookieBanner } from "@/components/shared/cookie-banner";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Pular para conteúdo
      </a>
      <Header />
      <div id="main-content">{children}</div>
      <Footer />
      <WhatsAppFab />
      <PiliRobo />
      <CookieBanner />
    </>
  );
}
