import { generatePageMetadata } from "@/lib/seo";
import { COMPANY, SITE_URL } from "@/lib/constants";
import { Link } from "@/i18n/routing";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Termos de Uso",
    description:
      "Termos de uso do site PILI Industrial. Condições de acesso, propriedade intelectual, limitação de responsabilidade e legislação aplicável.",
    path: "/termos",
    noIndex: true,
  });
}

export default function TermosPage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
            Termos de Uso
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-pili-cement">
            Última atualização: Janeiro 2025
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* 1 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              1. Aceitação dos termos
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Ao acessar e utilizar o site {SITE_URL} (&quot;Site&quot;), você
              concorda integralmente com estes Termos de Uso. Caso não concorde
              com qualquer disposição, recomendamos que não utilize o Site. O
              Site é operado pela {COMPANY.name}, inscrita no CNPJ{" "}
              {COMPANY.cnpj}, com sede em {COMPANY.address}, Brasil.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              2. Objeto
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Este Site tem como finalidade apresentar os produtos, serviços e
              soluções da PILI Industrial, permitir o contato comercial,
              solicitação de orçamentos e download de materiais técnicos. As
              informações disponibilizadas possuem caráter informativo e não
              constituem oferta comercial vinculante.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              3. Propriedade intelectual
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Todo o conteúdo deste Site, incluindo textos, imagens, fotografias,
              logotipos, marcas, design, layout, especificações técnicas,
              catálogos e demais materiais são de propriedade exclusiva da{" "}
              {COMPANY.name} ou de seus licenciadores, sendo protegidos pela
              legislação brasileira de propriedade intelectual.
            </p>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              É vedada a reprodução, distribuição, modificação ou utilização
              comercial de qualquer conteúdo deste Site sem autorização prévia e
              expressa por escrito da PILI Industrial.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              4. Uso permitido
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              O usuário se compromete a utilizar o Site de forma lícita e em
              conformidade com estes Termos. É proibido:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Utilizar o Site para fins ilegais ou não autorizados",
                "Tentar acessar áreas restritas ou sistemas internos sem autorização",
                "Transmitir conteúdo malicioso, vírus ou códigos que possam danificar o Site",
                "Coletar dados pessoais de outros usuários sem consentimento",
                "Utilizar mecanismos automatizados de coleta de dados (scraping, crawling) sem autorização",
                "Reproduzir especificações técnicas para fins de engenharia reversa de produtos",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-cement" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              5. Especificações técnicas e preços
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              As especificações técnicas, dimensões, capacidades e demais
              informações sobre os produtos apresentados neste Site são
              fornecidas a título informativo e podem ser alteradas sem aviso
              prévio. Os valores e preços não são exibidos no Site; orçamentos
              são elaborados sob consulta conforme as necessidades específicas de
              cada projeto.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              6. Limitação de responsabilidade
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              A PILI Industrial se empenha em manter as informações do Site
              atualizadas e precisas, porém não garante a ausência de erros,
              interrupções ou indisponibilidade. O Site é disponibilizado
              &quot;como está&quot;, sem garantias expressas ou implícitas de
              qualquer natureza.
            </p>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              A PILI Industrial não se responsabiliza por danos diretos ou
              indiretos resultantes do uso ou da impossibilidade de uso do Site,
              incluindo perda de dados, lucros cessantes ou danos a equipamentos.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              7. Links para terceiros
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Este Site pode conter links para sites de terceiros, incluindo
              plataformas do ecossistema PILI (Store, Tech, Raste, Harbor). A
              PILI Industrial não se responsabiliza pelo conteúdo, políticas de
              privacidade ou práticas de sites de terceiros. O acesso a esses
              links é de inteira responsabilidade do usuário.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              8. Formulários e dados pessoais
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              O tratamento de dados pessoais coletados através dos formulários
              deste Site é regido pela nossa{" "}
              <Link
                href="/politica-privacidade"
                className="font-semibold text-pili-black underline transition-colors hover:text-pili-safety-deep"
              >
                Política de Privacidade
              </Link>
              , que é parte integrante destes Termos de Uso.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              9. Alterações nos termos
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              A PILI Industrial reserva-se o direito de alterar estes Termos de
              Uso a qualquer momento, sem aviso prévio. A versão mais recente
              estará sempre disponível nesta página com a data da última
              atualização. O uso continuado do Site após alterações constitui
              aceitação dos novos termos.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              10. Legislação aplicável e foro
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Estes Termos de Uso são regidos pela legislação da República
              Federativa do Brasil. Fica eleito o foro da Comarca de Erechim/RS
              para dirimir quaisquer controvérsias decorrentes destes Termos, com
              renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              11. Contato
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <div className="mt-4 border border-pili-mist bg-pili-paper p-6">
              <p className="font-mono text-sm text-pili-black">
                {COMPANY.name}
                <br />
                CNPJ: {COMPANY.cnpj}
                <br />
                E-mail: {COMPANY.email}
                <br />
                Telefone: {COMPANY.phone}
                <br />
                {COMPANY.address} - Brasil
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
