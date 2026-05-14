import { generatePageMetadata } from "@/lib/seo";
import { COMPANY, SITE_URL } from "@/lib/constants";
import { Link } from "@/i18n/routing";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Termos de Uso",
    description:
      "Termos de uso do site PILI Industrial. Condicoes de acesso, propriedade intelectual, limitacao de responsabilidade e legislacao aplicavel.",
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
            Ultima atualizacao: Janeiro 2025
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* 1 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              1. Aceitacao dos termos
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Ao acessar e utilizar o site {SITE_URL} (&quot;Site&quot;), voce
              concorda integralmente com estes Termos de Uso. Caso nao concorde
              com qualquer disposicao, recomendamos que nao utilize o Site. O
              Site e operado pela {COMPANY.name}, inscrita no CNPJ{" "}
              {COMPANY.cnpj}, com sede em {COMPANY.address}, Brasil.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              2. Objeto
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Este Site tem como finalidade apresentar os produtos, servicos e
              solucoes da PILI Industrial, permitir o contato comercial,
              solicitacao de orcamentos e download de materiais tecnicos. As
              informacoes disponibilizadas possuem carater informativo e nao
              constituem oferta comercial vinculante.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              3. Propriedade intelectual
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Todo o conteudo deste Site, incluindo textos, imagens, fotografias,
              logotipos, marcas, design, layout, especificacoes tecnicas,
              catalogos e demais materiais sao de propriedade exclusiva da{" "}
              {COMPANY.name} ou de seus licenciadores, sendo protegidos pela
              legislacao brasileira de propriedade intelectual.
            </p>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              E vedada a reproducao, distribuicao, modificacao ou utilizacao
              comercial de qualquer conteudo deste Site sem autorizacao previa e
              expressa por escrito da PILI Industrial.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              4. Uso permitido
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              O usuario se compromete a utilizar o Site de forma licita e em
              conformidade com estes Termos. E proibido:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Utilizar o Site para fins ilegais ou nao autorizados",
                "Tentar acessar areas restritas ou sistemas internos sem autorizacao",
                "Transmitir conteudo malicioso, virus ou codigos que possam danificar o Site",
                "Coletar dados pessoais de outros usuarios sem consentimento",
                "Utilizar mecanismos automatizados de coleta de dados (scraping, crawling) sem autorizacao",
                "Reproduzir especificacoes tecnicas para fins de engenharia reversa de produtos",
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
              5. Especificacoes tecnicas e precos
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              As especificacoes tecnicas, dimensoes, capacidades e demais
              informacoes sobre os produtos apresentados neste Site sao
              fornecidas a titulo informativo e podem ser alteradas sem aviso
              previo. Os valores e precos nao sao exibidos no Site; orcamentos
              sao elaborados sob consulta conforme as necessidades especificas de
              cada projeto.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              6. Limitacao de responsabilidade
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              A PILI Industrial se empenha em manter as informacoes do Site
              atualizadas e precisas, porem nao garante a ausencia de erros,
              interrupcoes ou indisponibilidade. O Site e disponibilizado
              &quot;como esta&quot;, sem garantias expressas ou implicitas de
              qualquer natureza.
            </p>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              A PILI Industrial nao se responsabiliza por danos diretos ou
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
              PILI Industrial nao se responsabiliza pelo conteudo, politicas de
              privacidade ou praticas de sites de terceiros. O acesso a esses
              links e de inteira responsabilidade do usuario.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              8. Formularios e dados pessoais
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              O tratamento de dados pessoais coletados atraves dos formularios
              deste Site e regido pela nossa{" "}
              <Link
                href="/politica-privacidade"
                className="font-semibold text-pili-black underline transition-colors hover:text-pili-safety-deep"
              >
                Politica de Privacidade
              </Link>
              , que e parte integrante destes Termos de Uso.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              9. Alteracoes nos termos
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              A PILI Industrial reserva-se o direito de alterar estes Termos de
              Uso a qualquer momento, sem aviso previo. A versao mais recente
              estara sempre disponivel nesta pagina com a data da ultima
              atualizacao. O uso continuado do Site apos alteracoes constitui
              aceitacao dos novos termos.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              10. Legislacao aplicavel e foro
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Estes Termos de Uso sao regidos pela legislacao da Republica
              Federativa do Brasil. Fica eleito o foro da Comarca de Erechim/RS
              para dirimir quaisquer controversias decorrentes destes Termos, com
              renuncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              11. Contato
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Para duvidas sobre estes Termos de Uso, entre em contato:
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
