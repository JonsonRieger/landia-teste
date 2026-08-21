import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import LandiaVSL from "@/components/LandiaVSL";
import { Reveal, RevealGroup, stepDelay } from "@/components/Reveal";

import almaLeveAvif from "@/assets/showcase/alma-leve.avif";
import almaLeveWebp from "@/assets/showcase/alma-leve.webp";
import brasaAvif from "@/assets/showcase/brasa-47.avif";
import brasaWebp from "@/assets/showcase/brasa-47.webp";
import formaLabAvif from "@/assets/showcase/forma-lab.avif";
import formaLabWebp from "@/assets/showcase/forma-lab.webp";
import luminaAvif from "@/assets/showcase/lumina-prime.avif";
import luminaWebp from "@/assets/showcase/lumina-prime.webp";
import nexoAvif from "@/assets/showcase/nexo-crm.avif";
import nexoWebp from "@/assets/showcase/nexo-crm.webp";
import norteCapitalAvif from "@/assets/showcase/norte-capital.avif";
import norteCapitalWebp from "@/assets/showcase/norte-capital.webp";
import raizBotanicaAvif from "@/assets/showcase/raiz-botanica.avif";
import raizBotanicaWebp from "@/assets/showcase/raiz-botanica.webp";
import ramosValeAvif from "@/assets/showcase/ramos-vale.avif";
import ramosValeWebp from "@/assets/showcase/ramos-vale.webp";
import verticeAvif from "@/assets/showcase/vertice.avif";
import verticeWebp from "@/assets/showcase/vertice.webp";
import vozDeMarcaAvif from "@/assets/showcase/voz-de-marca.avif";
import vozDeMarcaWebp from "@/assets/showcase/voz-de-marca.webp";
import phoneAiWebp from "@/assets/hero/landia-phone-ai-saas.webp";
import phoneArchitectureWebp from "@/assets/hero/landia-phone-architecture.webp";
import phoneEcommerceWebp from "@/assets/hero/landia-phone-ecommerce.webp";
import phoneWellnessWebp from "@/assets/hero/landia-phone-wellness.webp";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Land-IA | Crie Landing Pages com IA" },
      {
        name: "description",
        content:
          "Crie landing pages profissionais com ChatGPT + Lovable, publique no seu próprio domínio e transforme o processo em autonomia ou serviço — sem programar.",
      },
      { name: "theme-color", content: "#0B0D10" },
      { property: "og:title", content: "Land-IA | Crie landing pages que parecem caras" },
      {
        property: "og:description",
        content:
          "Estratégia, copy, construção e domínio próprio com ChatGPT + Lovable — sem precisar programar.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.metamove.online/" },
      { property: "og:site_name", content: "Land-IA" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://www.metamove.online/og-landia-v2.jpg" },
      { property: "og:image:secure_url", content: "https://www.metamove.online/og-landia-v2.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Land-IA — Landing Pages com IA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Land-IA | Crie landing pages que parecem caras" },
      {
        name: "twitter:description",
        content:
          "Estratégia, copy, construção e domínio próprio com ChatGPT + Lovable — sem precisar programar.",
      },
      { name: "twitter:image", content: "https://www.metamove.online/og-landia-v2.jpg" },
      { name: "twitter:image:alt", content: "Land-IA — Landing Pages com IA" },
    ],
    links: [{ rel: "canonical", href: "https://www.metamove.online/" }],
  }),
});

/* ================================================================
   TRACKING — preservado da raiz otimizada
   ================================================================ */
async function sendFacebookEvent(eventName: string) {
  try {
    const eventId = crypto.randomUUID();

    const fbp = document.cookie
      .split("; ")
      .find((c) => c.startsWith("_fbp="))
      ?.split("=")[1];

    const fbc = document.cookie
      .split("; ")
      .find((c) => c.startsWith("_fbc="))
      ?.split("=")[1];

    await fetch("https://metamove-capi.hebrithan.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: window.location.href,
        user_agent: navigator.userAgent,
        fbp,
        fbc,
      }),
    });

    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, {}, { eventID: eventId });
    }
  } catch (error) {
    console.error("Erro ao enviar evento:", error);
  }
}

const CHECKOUT_URL =
  "https://pay.hotmart.com/Y107168906J?checkoutMode=10&bid=1786752624031";

function CTAButton({
  children,
  href = CHECKOUT_URL,
  variant = "orange",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  variant?: "orange" | "lime" | "ink" | "white";
  className?: string;
}) {
  const isExternal = href.startsWith("http");
  const isCheckout = href.includes("hotmart.com");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        if (isCheckout) {
          sendFacebookEvent("InitiateCheckout");
          return;
        }
        if (href.startsWith("#")) {
          const target = document.getElementById(href.slice(1));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }}
      className={`forge-btn forge-btn-${variant} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" />
    </a>
  );
}

function Picture({
  avif,
  webp,
  alt,
  width,
  height,
  className = "",
}: {
  avif: string;
  webp: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <picture className={className}>
      <source srcSet={avif} type="image/avif" />
      <img
        src={webp}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
    </picture>
  );
}

function SectionTag({ index, children, light = false }: { index: string; children: ReactNode; light?: boolean }) {
  return (
    <div className={`forge-tag ${light ? "forge-tag-light" : ""}`}>
      <span>{index}</span>
      <i />
      <strong>{children}</strong>
    </div>
  );
}

function SectionCTA({
  eyebrow,
  children,
  button,
  variant = "lime",
}: {
  eyebrow: string;
  children: ReactNode;
  button: string;
  variant?: "orange" | "lime" | "ink" | "white";
}) {
  return (
    <Reveal className="forge-section-cta">
      <div>
        <span>{eyebrow}</span>
        <p>{children}</p>
      </div>
      <CTAButton variant={variant}>{button}</CTAButton>
    </Reveal>
  );
}

const FAQSection = lazy(() => import("@/components/FAQSection"));

function DeferredFAQ() {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    const trigger = triggerRef.current;
    if (!trigger || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1800px 0px" },
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={triggerRef}>
      {shouldLoad ? (
        <Suspense fallback={null}>
          <FAQSection />
        </Suspense>
      ) : null}
    </div>
  );
}

let pageViewSent = false;
let timeOnPageSent = false;

function Landing() {
  useEffect(() => {
    if (!pageViewSent) {
      pageViewSent = true;
      sendFacebookEvent("PageView");
    }

    const timer = window.setTimeout(() => {
      if (timeOnPageSent) return;
      timeOnPageSent = true;
      sendFacebookEvent("TimeOnPage");
    }, 30000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="forge-page min-h-screen bg-[var(--carbon)] text-white antialiased">
      <OfferRail />
      <Hero />
      <VslLeadIn />
      <LandiaVSL />
      <Reality />
      <Proofs />
      <Mechanism />
      <Product />
      <Offer />
      <Comparison />
      <Objections />
      <Decision />
      <DeferredFAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* ================================================================
   00 — TOP RAIL
   ================================================================ */
function OfferRail() {
  return (
    <div className="forge-offer-rail">
      <div className="forge-shell forge-offer-rail-inner">
        <div className="forge-urgency-message">
          <span className="forge-urgency-pulse" aria-hidden="true" />
          <strong>PARE DE ADIAR SUA PRÓXIMA LANDING</strong>
          <span>ACESSO IMEDIATO</span>
        </div>
        <div className="forge-offer-price">
          <span>UMA ÚNICA VEZ</span>
          <strong>R$ 47</strong>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   01 — HERO / BUILD STAGE
   ================================================================ */
const HERO_PAGES = [
  [phoneAiWebp, "IA / SAAS", "Landing futurista para tecnologia"],
  [phoneArchitectureWebp, "ARQUITETURA", "Landing editorial premium"],
  [phoneEcommerceWebp, "E-COMMERCE", "Landing comercial para produto"],
  [phoneWellnessWebp, "WELLNESS", "Landing clean de alta percepção"],
];

function HeroBuildVisual() {
  return (
    <div className="forge-phone-showcase">
      <div className="forge-phone-caption">
        <span>UM PROCESSO</span>
        <b>DIREÇÕES INFINITAS</b>
      </div>

      {HERO_PAGES.map(([src, label, alt], i) => {
        const isLcpImage = i === 1;

        return (
          <figure
            key={String(label)}
            className={`forge-phone-card forge-phone-card-${i + 1}`}
          >
            <img
              src={String(src)}
              alt={String(alt)}
              width={512}
              height={768}
              loading={isLcpImage ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={isLcpImage ? "high" : "low"}
            />
            <figcaption>{label}</figcaption>
          </figure>
        );
      })}

      <div className="forge-phone-proof">
        <strong>4 NICHOS. 4 DIREÇÕES.</strong>
        <span>SEM TEMPLATE ENGESSADO.</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="forge-hero">
      <div className="forge-hero-orbit" aria-hidden="true" />
      <div className="forge-shell forge-hero-grid">
        <div className="forge-hero-copy">
          <div data-enter="" className="forge-hero-kicker">
            <span /> PARA SUAS OFERTAS OU PARA VENDER COMO SERVIÇO
          </div>

          <h1>
            <span>UMA LANDING</span>
            <span className="forge-outline-word">VENCEDORA.</span>
            <span className="forge-lime-line">COPIANDO E</span>
            <span className="forge-lime-line">COLANDO PROMPT.</span>
          </h1>

          <p className="forge-hero-lead">
            Crie uma landing page que <strong>CONVERTE</strong> com <strong>ChatGPT + Lovable</strong>, publique no seu próprio domínio e pare de pagar por cada nova página — começando com IA&apos;s gratuitas.
          </p>

          <div className="forge-hero-actions">
            <CTAButton variant="lime">QUERO CRIAR MINHA LANDING — R$ 47</CTAButton>
          </div>
          <div className="forge-hero-note">
              <span>USE NAS SUAS OFERTAS</span>
              <span>VENDA COMO SERVIÇO</span>
              <span>SEM PROGRAMAR</span>
          </div>

          <div className="forge-tool-line" aria-label="Fluxo de ferramentas">
            {['CHATGPT', 'LOVABLE', 'GITHUB', 'VERCEL', 'SEU DOMÍNIO'].map((tool, i) => (
              <span key={tool}>
                <b>{String(i + 1).padStart(2, '0')}</b>{tool}
              </span>
            ))}
          </div>
        </div>

        <HeroBuildVisual />
      </div>

      <div className="forge-hero-footer">
        <span>ARQUITETURA ANTES DA IA.</span>
        <i />
        <span>DECISÃO → INSTRUÇÃO → EXECUÇÃO → PUBLICAÇÃO</span>
      </div>
    </section>
  );
}

/* ================================================================
   02 — VSL
   ================================================================ */
function VslLeadIn() {
  return (
    <section id="vsl" className="forge-vsl-intro">
      <div className="forge-shell">
        <Reveal className="forge-vsl-title-row">
          <SectionTag index="02">ANTES DE CONTINUAR</SectionTag>
          <div>
            <h2>Não vou pedir que você acredite.</h2>
            <p>Vou te mostrar como transformar IA gratuita em uma página comercial — sem depender de designer nem queimar créditos em tentativa e erro.</p>
          </div>
          <span className="forge-play-index">05:17</span>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   03 — REALIDADE DA PERSONA
   ================================================================ */
const CLICK_STORY = [
  ["👀", "ELE CLICOU PORQUE SE INTERESSOU", "Seu anúncio fez o trabalho: parou a pessoa, despertou desejo e trouxe o lead até você."],
  ["😕", "A PÁGINA ESFRIOU A VONTADE", "Texto apertado, promessa vaga e informação demais. Em vez de avançar, ele começa a ter dúvidas."],
  ["💸", "ELE VOLTOU PARA O FEED", "O checkout não aconteceu. Você pagou pelo clique — e ficou apenas com a conta do anúncio."],
];

const LANDIA_WINS = [
  ["01", "ENTENDE EM SEGUNDOS", "“Isso é exatamente para mim.”"],
  ["02", "SENTE SEGURANÇA", "“Agora entendi por que funciona.”"],
  ["03", "AVANÇA AO CHECKOUT", "“Faz sentido comprar agora.”"],
];

function Reality() {
  return (
    <section className="forge-reality">
      <div className="forge-shell">
        <Reveal className="forge-reality-head">
          <SectionTag index="03" light>O PROBLEMA REAL</SectionTag>
          <h2>
            SEU ANÚNCIO CONSEGUE O CLIQUE.
            <span>MAS SUA PÁGINA DEIXA O CHECKOUT ESCAPAR?</span>
          </h2>
          <p>
            Se o lead clicou, ele já levantou a mão. O problema começa quando encontra uma página bonita, porém confusa, que não responde rápido: <mark className="forge-mark forge-mark-orange">“por que eu deveria comprar isso agora?”</mark>
          </p>
        </Reveal>

        <RevealGroup className="forge-click-story">
          <div className="forge-story-list">
            <span className="forge-story-eyebrow">O FILME QUE SE REPETE TODOS OS DIAS</span>
            {CLICK_STORY.map(([emoji, title, text], i) => (
              <article data-reveal="" style={stepDelay(i)} className="forge-story-card" key={title}>
                <span aria-hidden="true">{emoji}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </article>
            ))}
          </div>

          <div data-reveal="" style={stepDelay(2)} className="forge-story-pivot">
            <span>O CLIQUE NÃO É A VENDA.</span>
            <strong>É ONDE A CONVERSA COMEÇA.</strong>
            <p>Se a página não assume essa conversa com clareza, o dinheiro colocado no anúncio termina financiando mais uma visita sem checkout.</p>
          </div>
        </RevealGroup>

        <Reveal className="forge-landia-turnaround">
          <div className="forge-turnaround-copy">
            <span>🎯 COM LAND-IA</span>
            <h3>O LEAD NÃO PRECISA DECIFRAR SUA OFERTA.</h3>
            <p>Ele bate o olho, entende o valor e encontra um caminho natural até a compra.</p>
          </div>
          <div className="forge-turnaround-wins">
            {LANDIA_WINS.map(([number, title, text]) => (
              <article className="forge-turnaround-win" key={title}>
                <span>{number}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="forge-reality-mantra">
          <span>Você já pagou para o lead chegar.</span>
          <strong>Agora faça a página merecer esse clique.</strong>
        </Reveal>

        <SectionCTA eyebrow="SE O GARGALO ESTÁ DEPOIS DO CLIQUE" button="QUERO PARAR DE PERDER CLIQUES" variant="white">
          Construa uma página que explica, convence e conduz ao checkout — sem depender de improviso.
        </SectionCTA>
      </div>
    </section>
  );
}

/* ================================================================
   04 — PROVAS / RESULTADO FINAL
   ================================================================ */
const SHOWCASE_PAGES = [
  { avif: luminaAvif, webp: luminaWebp, brand: "LUMINA PRIME", niche: "Estética premium", goal: "Agendamento", height: 1518 },
  { avif: nexoAvif, webp: nexoWebp, brand: "NEXO CRM", niche: "SaaS B2B", goal: "Demonstração", height: 1518 },
  { avif: brasaAvif, webp: brasaWebp, brand: "BRASA 47", niche: "Gastronomia", goal: "Reserva", height: 1518 },
  { avif: verticeAvif, webp: verticeWebp, brand: "VÉRTICE", niche: "Imóveis de luxo", goal: "Contato", height: 1518 },
  { avif: raizBotanicaAvif, webp: raizBotanicaWebp, brand: "RAIZ BOTÂNICA", niche: "Cosméticos", goal: "Compra", height: 1518 },
  { avif: ramosValeAvif, webp: ramosValeWebp, brand: "RAMOS & VALE", niche: "Advocacia", goal: "Consulta", height: 1518 },
  { avif: formaLabAvif, webp: formaLabWebp, brand: "FORMA LAB", niche: "Fitness", goal: "Avaliação", height: 1518 },
  { avif: almaLeveAvif, webp: almaLeveWebp, brand: "ALMA LEVE", niche: "Psicoterapia", goal: "Conversa", height: 1800 },
  { avif: vozDeMarcaAvif, webp: vozDeMarcaWebp, brand: "VOZ DE MARCA", niche: "Infoproduto", goal: "Inscrição", height: 1518 },
  { avif: norteCapitalAvif, webp: norteCapitalWebp, brand: "NORTE CAPITAL", niche: "Planejamento financeiro", goal: "Consultoria", height: 1518 },
];

function Proofs() {
  return (
    <section className="forge-showcase landia-cv-proofs">
      <div className="forge-shell">
        <Reveal className="forge-showcase-head">
          <SectionTag index="04">O RESULTADO FINAL</SectionTag>
          <h2>
            NÃO É SOBRE APRENDER A USAR IA.
            <span>É SOBRE PUBLICAR PÁGINAS NESSE NÍVEL.</span>
          </h2>
          <p>Algumas páginas criadas com o método Land-IA</p>
        </Reveal>
      </div>

      <div className="forge-showcase-stage">
        <div className="forge-showcase-ambient forge-showcase-ambient-a" aria-hidden="true" />
        <div className="forge-showcase-ambient forge-showcase-ambient-b" aria-hidden="true" />
        <RevealGroup className="forge-showcase-grid">
          {SHOWCASE_PAGES.map((page, index) => (
            <article
              data-reveal=""
              style={stepDelay(index % 5)}
              className="forge-showcase-card"
              key={page.brand}
            >
              <div className="forge-showcase-phone">
                <div className="forge-showcase-speaker" aria-hidden="true" />
                <div className="forge-showcase-screen">
                  <Picture
                    avif={page.avif}
                    webp={page.webp}
                    alt={`Landing page mobile da ${page.brand}, criada com o método Land-IA`}
                    width={720}
                    height={page.height}
                  />
                  <span className="forge-showcase-glass" aria-hidden="true" />
                </div>
              </div>
              <div className="forge-showcase-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{page.brand}</strong>
                  <p>{page.niche} <i /> {page.goal}</p>
                </div>
              </div>
            </article>
          ))}
        </RevealGroup>
      </div>

      <div className="forge-shell">
        <Reveal className="forge-showcase-close">
          <span>10 MERCADOS. 10 DIREÇÕES VISUAIS.</span>
          <h3>UMA HABILIDADE.<br /><strong>INÚMERAS POSSIBILIDADES.</strong></h3>
          <p>
            Para vender sua própria oferta ou transformar landing pages em uma nova fonte de renda — sem ficar refém de designer, código ou créditos desperdiçados.
          </p>
        </Reveal>

        <SectionCTA eyebrow="O RESULTADO ESTÁ NA TELA" button="QUERO CRIAR PÁGINAS NESSE NÍVEL" variant="lime">
          Aprenda o método que transforma sua ideia em uma página profissional, pronta para vender no mobile.
        </SectionCTA>
      </div>
    </section>
  );
}

/* ================================================================
   05 — MECANISMO
   ================================================================ */
const REVERSE_CHAIN = [
  ["06", "DECISÃO", "O que precisa acontecer no fim?"],
  ["05", "SEGURANÇA", "O que precisa deixar de parecer arriscado?"],
  ["04", "OFERTA", "O que precisa parecer valioso agora?"],
  ["03", "EVIDÊNCIA", "O que precisa ser demonstrado?"],
  ["02", "MECANISMO", "O que torna essa solução diferente?"],
  ["01", "PROMESSA", "O que precisa prender a primeira atenção?"],
];

function Mechanism() {
  return (
    <section className="forge-mechanism landia-cv-mechanism">
      <div className="forge-shell">
        <Reveal className="forge-mechanism-head">
          <SectionTag index="05" light>ENGENHARIA REVERSA DA CONVERSÃO™</SectionTag>
          <h2>COMECE PELO FIM.<br /><span>CONSTRUA O CAMINHO DE VOLTA.</span></h2>
          <p>
            <mark className="forge-mark forge-mark-orange">Página bonita não salva argumento fraco.</mark> Você começa pela decisão final do visitante e trabalha de trás para frente até a promessa que prende a atenção.
          </p>
        </Reveal>

        <RevealGroup className="forge-reverse-chain">
          {REVERSE_CHAIN.map(([n, title, text], i) => (
            <div data-reveal="" style={stepDelay(i)} className={`forge-reverse-row forge-reverse-row-${i}`} key={title}>
              <span className="forge-reverse-number">{n}</span>
              <strong>{title}</strong>
              <p>{text}</p>
              <span className="forge-reverse-arrow">←</span>
            </div>
          ))}
        </RevealGroup>

        <Reveal className="forge-mechanism-rule">
          <span>ARQUITETURA ANTES DA IA.</span>
          <strong>Você deixa de pedir ideias e começa a entregar direção.</strong>
        </Reveal>

        <SectionCTA eyebrow="A IA NÃO PRECISA SER MAIS CARA" button="QUERO O PROCESSO COMPLETO" variant="white">
          Ela precisa receber uma instrução melhor — para você parar de comprar créditos só para corrigir o que outro prompt quebrou.
        </SectionCTA>
      </div>
    </section>
  );
}

/* ================================================================
   06 — PRODUTO
   ================================================================ */
const LESSONS = [
  ["01", "ANTES DE ABRIR A IA", "Por que páginas bonitas não são necessariamente páginas estrategicamente construídas."],
  ["02", "ENGENHARIA REVERSA", "Construa a jornada começando pela decisão final."],
  ["03", "O PROMPT MESTRE", "Transforme a arquitetura em uma instrução completa."],
  ["04", "CONSTRUINDO COM IA", "Leve o Prompt Mestre ao Lovable e ajuste sem reconstruir o que já ficou bom."],
  ["05", "DE BONITA PARA PRONTA", "Auditoria, ajustes e correções cirúrgicas."],
  ["06", "CHECKOUT + MOBILE", "Links, CTA, responsividade e revisão final."],
  ["07", "SEU PRÓPRIO DOMÍNIO", "Lovable → GitHub → Vercel → DNS → domínio."],
];

function Product() {
  return (
    <section className="forge-product landia-cv-product">
      <div className="forge-shell">
        <Reveal className="forge-product-head">
          <SectionTag index="06">O PRODUTO</SectionTag>
          <div>
            <h2>ECONOMIZE NAS SUAS PÁGINAS — E TRANSFORME IA EM UMA POSSÍVEL RENDA EXTRA.</h2>
            <p>Crie para suas próprias ofertas, <mark className="forge-mark forge-mark-lime">pare de pagar designer a cada nova ideia</mark> ou use o mesmo processo para entregar landing pages a clientes.</p>
          </div>
        </Reveal>

        <div className="forge-product-grid">
          <Reveal className="forge-product-spine">
            <span className="forge-product-vertical">LAND-IA / IMPLEMENTAÇÃO GUIADA</span>
            <div className="forge-product-screen">
              <div className="forge-product-screen-top"><span>LESSON 04</span><b>BUILD MODE</b></div>
              <div className="forge-product-screen-body">
                <small>DA ARQUITETURA PARA A TELA</small>
                <h3>CONSTRUA.<br />REVISE.<br /><span>PUBLIQUE.</span></h3>
                <div className="forge-product-progress"><i /></div>
                <div className="forge-product-screen-meta"><span>GRAVAÇÃO DE TELA</span><span>EXECUÇÃO REAL</span></div>
              </div>
            </div>
          </Reveal>

          <RevealGroup className="forge-curriculum">
            {LESSONS.map(([n, title, text], i) => (
              <div data-reveal="" style={stepDelay(i)} className="forge-lesson" key={title}>
                <span>{n}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
                <i />
              </div>
            ))}
          </RevealGroup>
        </div>

        <RevealGroup className="forge-bonus-grid">
          <article data-reveal="" className="forge-bonus forge-bonus-light">
            <span>BÔNUS 01 / PDF</span>
            <h3>BIBLIOTECA LAND-IA</h3>
            <p>Prompts operacionais para persona, oferta, mecanismo, hero, provas, objeções, FAQ, CTA, auditoria, mobile, CRO e correções cirúrgicas.</p>
            <strong>Não comece cada página do zero.</strong>
          </article>
          <article data-reveal="" style={stepDelay(1)} className="forge-bonus forge-bonus-dark">
            <span>BÔNUS 02 / E-BOOK</span>
            <h3>LANDING INVISÍVEL</h3>
            <p>Performance, WebP/AVIF, LCP, CLS, tracking, Pixel, CAPI, event_id, deduplicação, metadata, Vercel e troubleshooting.</p>
            <strong>A parte que o visitante não vê — mas o navegador vê.</strong>
          </article>
        </RevealGroup>

        <SectionCTA eyebrow="TREINAMENTO + 2 BÔNUS" button="VER A OFERTA COMPLETA" variant="lime">
          Abra, assista, execute e avance até a página publicada no seu domínio.
        </SectionCTA>
      </div>
    </section>
  );
}

/* ================================================================
   07 — OFERTA / VIEWCONTENT
   ================================================================ */
function Offer() {
  const offerRef = useRef<HTMLElement | null>(null);
  const hasTrackedViewContent = useRef(false);

  useEffect(() => {
    const section = offerRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !hasTrackedViewContent.current &&
          typeof window !== "undefined" &&
          typeof window.fbq === "function"
        ) {
          hasTrackedViewContent.current = true;
          sendFacebookEvent("ViewContent");
        }
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={offerRef} id="oferta" className="forge-offer landia-cv-offer">
      <div className="forge-offer-signal" aria-hidden="true">47</div>
      <div className="forge-shell forge-offer-grid">
        <Reveal className="forge-offer-copy">
          <SectionTag index="07">A OFERTA</SectionTag>
          <h2>PARE DE PAGAR POR CADA NOVA LANDING.<br /><span>DOMINE E REUTILIZE O PROCESSO POR R$ 47.</span></h2>
          <p>
            Você recebe o treinamento completo e os dois bônus para estruturar, construir e publicar páginas usando opções gratuitas — ou <mark className="forge-mark forge-mark-lime">transformar essa habilidade em serviço</mark> e criar uma nova fonte de renda com IA.
          </p>

          <div className="forge-stack-list">
            {[
              ["LAND-IA", "Treinamento prático completo", "R$ 147"],
              ["BIBLIOTECA LAND-IA", "Prompts e estruturas reutilizáveis", "R$ 97"],
              ["LANDING INVISÍVEL", "Performance, tracking e infraestrutura", "R$ 97"],
            ].map(([name, desc, value]) => (
              <div key={name}>
                <Check aria-hidden="true" />
                <span><strong>{name}</strong><small>{desc}</small></span>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="forge-price-block">
          <div className="forge-price-top"><Sparkles aria-hidden="true" /><span>ACESSO IMEDIATO • SEM MENSALIDADE</span></div>
          <div className="forge-price-reference"><span>VALOR DE REFERÊNCIA</span><s>R$ 341</s></div>
          <div className="forge-price-main"><span>HOJE</span><strong><small>R$</small>47</strong></div>
          <p>Pagamento único.</p>
          <CTAButton className="w-full" variant="orange">QUERO O LAND-IA AGORA</CTAButton>
          <div className="forge-price-safe"><Lock aria-hidden="true" /><span>Compra processada pela Hotmart</span></div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   08 — COMPARAÇÃO
   ================================================================ */
const PATHS = [
  ["01", "QUEIMAR CRÉDITOS", "Prompt genérico, correção infinita e uma IA desfazendo o que a outra acabou de acertar.", "TEMPO + CRÉDITOS PERDIDOS"],
  ["02", "PAGAR DESIGNER DE NOVO", "Enquanto tem gente vendendo página feita no Canva, você abre outro orçamento e continua dependente.", "CUSTO RECORRENTE"],
  ["03", "CRIAR — E PODER VENDER", "Use IA gratuita, publique no seu domínio e aplique o processo também em páginas para clientes.", "ECONOMIA + POSSÍVEL RENDA EXTRA", "active"],
];

function Comparison() {
  return (
    <section className="forge-comparison landia-cv-comparison">
      <div className="forge-shell">
        <Reveal className="forge-comparison-head">
          <SectionTag index="08" light>TRÊS CAMINHOS</SectionTag>
          <h2>SUA PRÓXIMA LANDING PODE SER OUTRA DESPESA.<br /><span>OU O COMEÇO DE UMA HABILIDADE VENDÁVEL.</span></h2>
        </Reveal>

        <RevealGroup className="forge-paths">
          {PATHS.map(([n, title, flow, result, active], i) => (
            <article data-reveal="" style={stepDelay(i)} className={`forge-path ${active ? 'forge-path-active' : ''}`} key={title}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{flow}</p>
              <strong>{result}</strong>
            </article>
          ))}
        </RevealGroup>

        <SectionCTA eyebrow="ESCOLHA O TERCEIRO CAMINHO" button="QUERO DOMINAR O PROCESSO" variant="ink">
          Tenha o método completo para construir, revisar e publicar suas próprias landing pages.
        </SectionCTA>
      </div>
    </section>
  );
}

/* ================================================================
   09 — OBJEÇÕES
   ================================================================ */
const OBJECTIONS = [
  ["EU NÃO SEI PROGRAMAR.", "Ótimo. O processo foi desenhado para quem precisa dirigir a construção sem escrever código."],
  ["EU NUNCA USEI LOVABLE.", "A implementação é acompanhada na prática, do Prompt Mestre até os ajustes e a publicação."],
  ["VOU PRECISAR PAGAR FERRAMENTAS PARA SEMPRE?", "A proposta é aproveitar as opções gratuitas para começar e levar o projeto para GitHub, Vercel e seu próprio domínio."],
  ["EU NÃO SOU DESIGNER.", "Você não precisa desenhar pixels. Precisa aprender a definir hierarquia, intenção e direção visual para a IA executar."],
  ["ENTÃO A IA FAZ TUDO?", "Não. E esse é o ponto: você toma as decisões que importam. A IA acelera a execução."],
  ["POSSO VENDER LANDING PAGES COMO SERVIÇO?", "Você aprende um processo aplicável a ofertas e nichos diferentes. A conquista de clientes e os resultados financeiros dependem da sua prospecção, execução e mercado."],
  ["ISSO GARANTE QUE TODA PÁGINA VAI CONVERTER?", "Não existe garantia honesta de conversão. O LAND-IA ajuda você a estruturar promessa, argumentos, provas, oferta e CTA com intenção — em vez de depender apenas de beleza."],
];

function Objections() {
  return (
    <section className="forge-objections landia-cv-objections">
      <div className="forge-shell">
        <Reveal className="forge-objections-head">
          <SectionTag index="09">SEM RODAPÉ MIÚDO</SectionTag>
          <h2>O QUE NORMALMENTE TRAVA ESSA DECISÃO.</h2>
        </Reveal>

        <RevealGroup className="forge-objection-list">
          {OBJECTIONS.map(([q, a], i) => (
            <article data-reveal="" style={stepDelay(i)} key={q}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{q}</h3>
              <p>{a}</p>
            </article>
          ))}
        </RevealGroup>

        <SectionCTA eyebrow="SEM PROGRAMAÇÃO. SEM MENSALIDADE." button="QUERO ACESSO IMEDIATO — R$ 47" variant="lime">
          Comece com as ferramentas gratuitas e avance com o processo completo do LAND-IA.
        </SectionCTA>
      </div>
    </section>
  );
}

/* ================================================================
   10 — DECISÃO
   ================================================================ */
function Decision() {
  return (
    <section className="forge-decision landia-cv-decision">
      <div className="forge-shell forge-decision-grid">
        <Reveal>
          <SectionTag index="10" light>SUA PRÓXIMA PÁGINA</SectionTag>
          <h2>VOCÊ PODE CONTINUAR PAGANDO POR PÁGINAS — ATÉ POR AQUELAS QUE ALGUÉM VENDERIA FAZENDO NO CANVA.</h2>
        </Reveal>
        <Reveal delay={0.08} className="forge-decision-answer">
          <span>OU</span>
          <h3>PODE TRANSFORMAR IA GRATUITA EM PÁGINAS PARA VOCÊ — E EM UM SERVIÇO PARA CLIENTES.</h3>
          <p>
            Use nas suas ofertas, economize terceirização ou transforme a habilidade em um serviço que você pode oferecer.
          </p>
          <CTAButton variant="ink">QUERO PARAR DE DEPENDER DE TERCEIROS</CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   11 — CTA FINAL
   ================================================================ */
function FinalCTA() {
  return (
    <section className="forge-final landia-cv-final">
      <div className="forge-final-ring" aria-hidden="true" />
      <div className="forge-shell forge-final-inner">
        <Reveal>
          <span className="forge-final-code">LAND-IA / READY TO BUILD</span>
          <h2>SUA PRÓXIMA LANDING NÃO PRECISA SER OUTRA CONTA.<br /><span>PODE SER UMA HABILIDADE QUE TRABALHA PARA VOCÊ.</span></h2>
          <p>Crie para suas ofertas, economize terceirização ou venda como serviço. Sem programação e começando com IA gratuita.</p>
          <CTAButton variant="orange">QUERO COMEÇAR AGORA — R$ 47</CTAButton>
          <small>Acesso imediato • pagamento único</small>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="forge-footer landia-cv-footer">
      <div className="forge-shell forge-footer-inner">
        <div><span className="forge-brand-mark">L//</span><strong>LAND-IA</strong></div>
        <p>Landing pages com IA • Arquitetura antes da IA.</p>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
