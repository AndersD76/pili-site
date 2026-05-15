import { generatePageMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Política de Privacidade",
    description:
      "Política de privacidade da PILI Industrial. Saiba como coletamos, armazenamos e utilizamos seus dados pessoais em conformidade com a LGPD.",
    path: "/política-privacidade",
    noIndex: true,
  });
}

export default function PoliticaPrivacidadePage() {
  return (
    <main className="pt-[var(--header-height)]">
      {/* Hero */}
      <section className="bg-pili-black py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-[length:var(--text-h1)] font-black uppercase text-pili-white">
            Política de Privacidade
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-pili-cement">
            Última atualização: Janeiro 2025
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          {/* 1. Controlador */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              1. Controlador dos dados
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              O controlador responsável pelo tratamento dos seus dados pessoais é:
            </p>
            <div className="mt-4 border border-pili-mist bg-pili-paper p-6">
              <p className="font-mono text-sm text-pili-black">
                {COMPANY.name}
                <br />
                CNPJ: {COMPANY.cnpj}
                <br />
                {COMPANY.address} - Brasil
                <br />
                E-mail: {COMPANY.email}
                <br />
                Telefone: {COMPANY.phone}
              </p>
            </div>
          </div>

          {/* 2. Dados coletados */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              2. Dados pessoais coletados
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Coletamos os seguintes dados pessoais através dos formulários
              disponíveis neste site:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Nome completo",
                "Endereço de e-mail",
                "Número de telefone",
                "Nome da empresa e CNPJ",
                "Cargo ou função",
                "País e estado",
                "Tipo de aplicação e produto de interesse",
                "Mensagens enviadas pelo formulário de contato",
                "Dados de navegação (cookies, IP, páginas visitadas)",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-cement" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Finalidades */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              3. Finalidades do tratamento
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Os dados pessoais coletados são utilizados para as seguintes
              finalidades:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Responder solicitações de orçamento e contato comercial",
                "Enviar catálogos, materiais técnicos e propostas comerciais",
                "Gerenciar o relacionamento com clientes e prospects",
                "Enviar comunicações sobre produtos, serviços e novidades (com consentimento)",
                "Melhorar a experiência de navegação e funcionalidade do site",
                "Cumprir obrigações legais e regulatorias",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-cement" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Base legal */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              4. Base legal para o tratamento
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              O tratamento de dados pessoais e realizado com base nas seguintes
              hipóteses legais previstas na Lei Geral de Proteção de Dados (Lei
              n. 13.709/2018 - LGPD):
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Consentimento do titular (Art. 7, I)",
                "Execução de contrato ou procedimentos preliminares (Art. 7, V)",
                "Interesse legitimo do controlador (Art. 7, IX)",
                "Cumprimento de obrigação legal ou regulatoria (Art. 7, II)",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-cement" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Compartilhamento */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              5. Compartilhamento de dados
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Seus dados pessoais podem ser compartilhados com:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Prestadores de serviços de tecnologia (hospedagem, e-mail, analytics)",
                "Representantes comerciais autorizados, para atendimento da sua solicitação",
                "Autoridades governamentais, quando exigido por lei ou ordem judicial",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-cement" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 leading-relaxed text-pili-concrete">
              Não vendemos, alugamos ou comercializamos seus dados pessoais a
              terceiros para fins de marketing.
            </p>
          </div>

          {/* 6. Retenção */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              6. Retenção dos dados
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Os dados pessoais serão armazenados pelo período necessário para
              cumprir as finalidades descritas nesta política, ou enquanto houver
              base legal para o tratamento. Dados de contato comercial sao
              mantidos por até 5 anos após a última interação, salvo solicitação
              de eliminação pelo titular.
            </p>
          </div>

          {/* 7. Direitos do titular */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              7. Direitos do titular
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Nos termos da LGPD, você tem direito a:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Confirmação da existência de tratamento de dados",
                "Acesso aos seus dados pessoais",
                "Correção de dados incompletos, inexatos ou desatualizados",
                "Anonimização, bloqueio ou eliminação de dados desnecessários",
                "Portabilidade dos dados a outro fornecedor",
                "Eliminação dos dados tratados com consentimento",
                "Revogação do consentimento a qualquer momento",
                "Informação sobre entidades com as quais os dados foram compartilhados",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-cement" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 leading-relaxed text-pili-concrete">
              Para exercer seus direitos, entre em contato pelo e-mail{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-semibold text-pili-black underline transition-colors hover:text-pili-safety-deep"
              >
                {COMPANY.email}
              </a>
              .
            </p>
          </div>

          {/* 8. Cookies */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              8. Cookies e tecnologias de rastreamento
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Este site utiliza cookies e tecnologias similares para melhorar a
              experiência de navegação, analisar o tráfego e personalizar
              conteúdo. Você pode configurar seu navegador para recusar cookies,
              embora isso possa afetar algumas funcionalidades do site.
            </p>
          </div>

          {/* 9. Segurança */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              9. Segurança dos dados
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Adotamos medidas técnicas e organizacionais adequadas para proteger
              seus dados pessoais contra acesso não autorizado, perda, alteração
              ou destruição. Isso inclui criptografia em trânsito (HTTPS),
              controle de acesso baseado em funções e backups regulares.
            </p>
          </div>

          {/* 10. Alterações */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              10. Alterações nesta política
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Esta política de privacidade pode ser atualizada periodicamente. A
              versão mais recente estará sempre disponível nesta página com a
              data da última atualização. Recomendamos que você revise esta
              política regularmente.
            </p>
          </div>

          {/* 11. Contato */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              11. Contato
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Para dúvidas, solicitações ou reclamações relacionadas a esta
              política de privacidade ou ao tratamento de seus dados pessoais,
              entre em contato:
            </p>
            <div className="mt-4 border border-pili-mist bg-pili-paper p-6">
              <p className="font-mono text-sm text-pili-black">
                {COMPANY.name}
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
