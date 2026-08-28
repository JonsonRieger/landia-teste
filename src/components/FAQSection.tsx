import { Reveal, RevealGroup, stepDelay } from "@/components/Reveal";

const FAQS = [
  [
    "Preciso saber programar ou já dominar o Lovable?",
    "Não. O processo foi desenhado para quem não programa e acompanha a implementação no Lovable, do Prompt Mestre até a revisão e a publicação.",
  ],
  [
    "O que exatamente eu recebo?",
    "Você recebe 7 aulas práticas do Land-IA, o PDF Biblioteca Land-IA e o e-book Landing Invisível. O conteúdo cobre estratégia, prompt, construção, mobile, checkout, performance, tracking e domínio próprio.",
  ],
  [
    "Preciso pagar ferramentas ou hospedagem todo mês?",
    "Você pode começar com as opções gratuitas de ChatGPT, Lovable, GitHub e Vercel. Para publicar em um endereço próprio, precisa ter um domínio, que não está incluído no valor do treinamento.",
  ],
  [
    "Como recebo o acesso?",
    "Após a confirmação do pagamento, a Hotmart envia as instruções de acesso para o e-mail informado na compra.",
  ],
  [
    "Posso usar o processo para criar páginas para clientes?",
    "Sim. O método pode ser aplicado em ofertas e nichos diferentes. A conquista de clientes e os resultados financeiros dependem da sua prospecção, execução e mercado.",
  ],
  [
    "A compra tem garantia? Isso garante conversão?",
    "A compra conta com 7 dias de garantia. O método não promete que qualquer página venderá: ele ajuda você a estruturar promessa, argumentos, provas, oferta e CTA com intenção, em vez de depender apenas de beleza.",
  ],
];

export default function FAQSection() {
  return (
    <section className="forge-faq landia-cv-faq">
      <div className="forge-faq-shell">
        <Reveal className="forge-faq-head">
          <div className="forge-tag forge-tag-light">
            <span>08</span>
            <i />
            <strong>PERGUNTAS FREQUENTES</strong>
          </div>
          <h2>O QUE VOCÊ PRECISA SABER ANTES DE COMEÇAR.</h2>
        </Reveal>

        <RevealGroup className="forge-faq-list">
          {FAQS.map(([q, a], i) => (
            <details key={q} data-reveal="" style={stepDelay(i)} className="forge-faq-item">
              <summary>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{q}</strong>
                <span className="forge-faq-plus">+</span>
              </summary>
              <p className="forge-faq-answer">{a}</p>
            </details>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
