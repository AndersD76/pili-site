import { generatePageMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";

export function generateMetadata() {
  return generatePageMetadata({
    title: "Politica de Privacidade",
    description:
      "Politica de privacidade da PILI Industrial. Saiba como coletamos, armazenamos e utilizamos seus dados pessoais em conformidade com a LGPD.",
    path: "/politica-privacidade",
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
            Politica de Privacidade
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-pili-cement">
            Ultima atualizacao: Janeiro 2025
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
              O controlador responsavel pelo tratamento dos seus dados pessoais e:
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
              Coletamos os seguintes dados pessoais atraves dos formularios
              disponiveis neste site:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Nome completo",
                "Endereco de e-mail",
                "Numero de telefone",
                "Nome da empresa e CNPJ",
                "Cargo ou funcao",
                "Pais e estado",
                "Tipo de aplicacao e produto de interesse",
                "Mensagens enviadas pelo formulario de contato",
                "Dados de navegacao (cookies, IP, paginas visitadas)",
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
              Os dados pessoais coletados sao utilizados para as seguintes
              finalidades:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Responder solicitacoes de orcamento e contato comercial",
                "Enviar catalogos, materiais tecnicos e propostas comerciais",
                "Gerenciar o relacionamento com clientes e prospects",
                "Enviar comunicacoes sobre produtos, servicos e novidades (com consentimento)",
                "Melhorar a experiencia de navegacao e funcionalidade do site",
                "Cumprir obrigacoes legais e regulatorias",
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
              hipoteses legais previstas na Lei Geral de Protecao de Dados (Lei
              n. 13.709/2018 - LGPD):
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Consentimento do titular (Art. 7, I)",
                "Execucao de contrato ou procedimentos preliminares (Art. 7, V)",
                "Interesse legitimo do controlador (Art. 7, IX)",
                "Cumprimento de obrigacao legal ou regulatoria (Art. 7, II)",
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
                "Prestadores de servicos de tecnologia (hospedagem, e-mail, analytics)",
                "Representantes comerciais autorizados, para atendimento da sua solicitacao",
                "Autoridades governamentais, quando exigido por lei ou ordem judicial",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-pili-cement" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 leading-relaxed text-pili-concrete">
              Nao vendemos, alugamos ou comercializamos seus dados pessoais a
              terceiros para fins de marketing.
            </p>
          </div>

          {/* 6. Retencao */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              6. Retencao dos dados
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Os dados pessoais serao armazenados pelo periodo necessario para
              cumprir as finalidades descritas nesta politica, ou enquanto houver
              base legal para o tratamento. Dados de contato comercial sao
              mantidos por ate 5 anos apos a ultima interacao, salvo solicitacao
              de eliminacao pelo titular.
            </p>
          </div>

          {/* 7. Direitos do titular */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              7. Direitos do titular
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Nos termos da LGPD, voce tem direito a:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-pili-concrete">
              {[
                "Confirmacao da existencia de tratamento de dados",
                "Acesso aos seus dados pessoais",
                "Correcao de dados incompletos, inexatos ou desatualizados",
                "Anonimizacao, bloqueio ou eliminacao de dados desnecessarios",
                "Portabilidade dos dados a outro fornecedor",
                "Eliminacao dos dados tratados com consentimento",
                "Revogacao do consentimento a qualquer momento",
                "Informacao sobre entidades com as quais os dados foram compartilhados",
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
              experiencia de navegacao, analisar o trafego e personalizar
              conteudo. Voce pode configurar seu navegador para recusar cookies,
              embora isso possa afetar algumas funcionalidades do site.
            </p>
          </div>

          {/* 9. Seguranca */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              9. Seguranca dos dados
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Adotamos medidas tecnicas e organizacionais adequadas para proteger
              seus dados pessoais contra acesso nao autorizado, perda, alteracao
              ou destruicao. Isso inclui criptografia em transito (HTTPS),
              controle de acesso baseado em funcoes e backups regulares.
            </p>
          </div>

          {/* 10. Alteracoes */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              10. Alteracoes nesta politica
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Esta politica de privacidade pode ser atualizada periodicamente. A
              versao mais recente estara sempre disponivel nesta pagina com a
              data da ultima atualizacao. Recomendamos que voce revise esta
              politica regularmente.
            </p>
          </div>

          {/* 11. Contato */}
          <div>
            <h2 className="font-display text-lg font-bold uppercase text-pili-black">
              11. Contato
            </h2>
            <p className="mt-3 leading-relaxed text-pili-concrete">
              Para duvidas, solicitacoes ou reclamacoes relacionadas a esta
              politica de privacidade ou ao tratamento de seus dados pessoais,
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
