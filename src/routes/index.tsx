import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import LandiaVSL from "@/components/LandiaVSL";
import { Reveal, RevealGroup, stepDelay } from "@/components/Reveal";

import almaLeveAvif from "@/assets/showcase/alma-leve-premium.avif";
import almaLeveWebp from "@/assets/showcase/alma-leve-premium.webp";
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
import authorPhotoAvif from "@/assets/author-photo-720.avif";
import authorPhotoWebp from "@/assets/author-photo-720.webp";
import authorResultAvif from "@/assets/author-result-720.avif";
import authorResultWebp from "@/assets/author-result-720.webp";
import serviceProofAvif from "@/assets/prova_social_6.avif";
import serviceProofWebp from "@/assets/prova_social_6.webp";
import kitAvif640 from "@/assets/method/landia-kit-640.avif";
import kitAvif1280 from "@/assets/method/landia-kit-1280.avif";
import kitWebp640 from "@/assets/method/landia-kit-640.webp";
import kitWebp1280 from "@/assets/method/landia-kit-1280.webp";

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
type FacebookCustomData = Record<string, string | number | boolean>;

const META_STANDARD_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "InitiateCheckout",
  "Purchase",
]);

function createEventId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sendFacebookEvent(
  eventName: string,
  customData: FacebookCustomData = {},
) {
  try {
    const eventId = createEventId();

    const fbp = document.cookie
      .split("; ")
      .find((c) => c.startsWith("_fbp="))
      ?.split("=")[1];

    const fbc = document.cookie
      .split("; ")
      .find((c) => c.startsWith("_fbc="))
      ?.split("=")[1];

    // O navegador recebe o evento imediatamente. A mesma identificação segue
    // para a CAPI, permitindo que a Meta deduplique as duas cópias.
    if (typeof window.fbq === "function") {
      window.fbq(
        META_STANDARD_EVENTS.has(eventName) ? "track" : "trackCustom",
        eventName,
        customData,
        { eventID: eventId },
      );
    }

    void fetch("https://metamove-capi.hebrithan.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: window.location.href,
        user_agent: navigator.userAgent,
        fbp,
        fbc,
        ...(Object.keys(customData).length > 0
          ? { custom_data: customData }
          : {}),
      }),
    }).catch((error) => {
      console.error(`Erro ao enviar ${eventName} via CAPI:`, error);
    });
  } catch (error) {
    console.error(`Erro ao rastrear ${eventName}:`, error);
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
          sendFacebookEvent("InitiateCheckout", {
            content_name: "LAND-IA",
            content_type: "product",
            value: 47,
            currency: "BRL",
          });
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

function StickyCheckoutCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;

    const problemSection = document.getElementById("problema-real");
    if (!problemSection) return;

    let hasRevealed = false;

    const revealAfterProblemSection = () => {
      if (hasRevealed || problemSection.getBoundingClientRect().top > 0) return;

      hasRevealed = true;

      setIsVisible(true);
      window.removeEventListener("scroll", revealAfterProblemSection);
    };

    revealAfterProblemSection();
    if (hasRevealed) return;

    window.addEventListener("scroll", revealAfterProblemSection, { passive: true });
    return () => window.removeEventListener("scroll", revealAfterProblemSection);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="forge-sticky-checkout" data-sticky-checkout="">
      <CTAButton className="forge-sticky-checkout-button" variant="lime">
        QUERO O LAND-IA — R$ 47
      </CTAButton>
    </div>
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
let viewContentSent = false;

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
      <StickyCheckoutCTA />
      <Hero />
      <VslLeadIn />
      <LandiaVSL />
      {/* Mantém o ponto de ativação do CTA fixo sem conteúdo ou espaço visual. */}
      <div id="problema-real" aria-hidden="true" />
      <Proofs />
      <Mechanism />
      <Product />
      <Offer />
      <Comparison />
      <Authority />
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
          <strong>COPIE. COLE. PERSONALIZE.</strong>
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
            <span>UMA PÁGINA</span>
            <span className="forge-outline-word">VENCEDORA.</span>
            <span className="forge-lime-line">COPIANDO E</span>
            <span className="forge-lime-line">COLANDO PROMPT.</span>
          </h1>

          <p className="forge-hero-lead">
            Crie uma landing page <strong>ESTRATÉGICA</strong> com <strong>ChatGPT + Lovable</strong>, publique no seu próprio domínio e pare de pagar por cada nova página — começando com IA&apos;s gratuitas.
          </p>

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

        <div className="forge-hero-visual">
          <HeroBuildVisual />
          <div className="forge-hero-actions forge-hero-visual-cta">
            <CTAButton href="#resultado-final" variant="lime">SÓ ACREDITO VENDO</CTAButton>
          </div>
        </div>
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
   04 — PROVAS / RESULTADO FINAL
   ================================================================ */
const SHOWCASE_PAGES = [
  { avif: luminaAvif, webp: luminaWebp, brand: "LUMINA PRIME", niche: "Estética premium", goal: "Agendamento", height: 1518, mobileOrder: 10 },
  { avif: nexoAvif, webp: nexoWebp, brand: "NEXO CRM", niche: "SaaS B2B", goal: "Demonstração", height: 1518, mobileOrder: 3 },
  { avif: brasaAvif, webp: brasaWebp, brand: "BRASA 47", niche: "Gastronomia", goal: "Reserva", height: 1518, mobileOrder: 4 },
  { avif: verticeAvif, webp: verticeWebp, brand: "VÉRTICE", niche: "Imóveis de luxo", goal: "Contato", height: 1518, mobileOrder: 9 },
  { avif: raizBotanicaAvif, webp: raizBotanicaWebp, brand: "RAIZ BOTÂNICA", niche: "Cosméticos", goal: "Compra", height: 1518, mobileOrder: 8 },
  { avif: ramosValeAvif, webp: ramosValeWebp, brand: "RAMOS & VALE", niche: "Advocacia", goal: "Consulta", height: 1518, mobileOrder: 6 },
  { avif: formaLabAvif, webp: formaLabWebp, brand: "FORMA LAB", niche: "Fitness", goal: "Avaliação", height: 1518, mobileOrder: 2 },
  { avif: almaLeveAvif, webp: almaLeveWebp, brand: "ALMA LEVE", niche: "Psicoterapia", goal: "Conversa", height: 1518, mobileOrder: 5 },
  { avif: vozDeMarcaAvif, webp: vozDeMarcaWebp, brand: "VOZ DE MARCA", niche: "Infoproduto", goal: "Inscrição", height: 1518, mobileOrder: 1 },
  { avif: norteCapitalAvif, webp: norteCapitalWebp, brand: "NORTE CAPITAL", niche: "Planejamento financeiro", goal: "Consultoria", height: 1518, mobileOrder: 7 },
];

type ShowcaseCardStyle = CSSProperties & { "--mobile-order": number };

function Proofs() {
  return (
    <section id="resultado-final" className="forge-showcase landia-cv-proofs">
      <div className="forge-shell">
        <Reveal className="forge-showcase-head">
          <SectionTag index="04">O RESULTADO FINAL</SectionTag>
          <h2>
            ENTÃO TOMA! COM OS PROMPTS CERTOS, 
            <span>VOCÊ TEM RESULTADOS COMO ESSES:</span>
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
              style={{ ...stepDelay(index % 5), "--mobile-order": page.mobileOrder } as ShowcaseCardStyle}
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
                <span className="forge-showcase-index-desktop">{String(index + 1).padStart(2, "0")}</span>
                <span className="forge-showcase-index-mobile">{String(page.mobileOrder).padStart(2, "0")}</span>
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
        <SectionCTA eyebrow="UM PROCESSO TOTALMENTE REPLICÁVEL." button="QUERO CRIAR PÁGINAS NESSE NÍVEL — R$ 47" variant="lime">
          Aprenda o método que transforma sua ideia em uma página profissional, pronta para começar a vender.
        </SectionCTA>

        <Reveal className="forge-showcase-close">
          <span>REPLIQUE QUANTAS VEZES QUISER.</span>
          <h3>UMA HABILIDADE.<br /><strong>INÚMERAS POSSIBILIDADES.</strong></h3>
          <p>
            Para vender sua própria oferta ou transformar landing pages em uma nova fonte de renda — sem ficar refém de designer, código ou créditos desperdiçados.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   04.1 — AUTORIDADE / PROVA HUMANA
   ================================================================ */
function Authority() {
  return (
    <section className="forge-authority landia-cv-authority">
      <div className="forge-shell">
        <Reveal className="forge-authority-head">
          <SectionTag index="04.1" light>POR TRÁS DO MÉTODO</SectionTag>
          <h2>
            NÃO NASCEU DE UM PROMPT BONITO.
            <span>NASCEU DA NECESSIDADE DE FAZER A PÁGINA VENDER.</span>
          </h2>
        </Reveal>

        <div className="forge-authority-grid">
          <Reveal as="figure" className="forge-authority-portrait">
            <Picture
              avif={authorPhotoAvif}
              webp={authorPhotoWebp}
              alt="Hebrithan Rieger, criador do método Land-IA"
              width={720}
              height={1013}
            />
            <figcaption>
              <strong>HEBRITHAN RIEGER</strong>
              <span>CRIADOR DO LAND-IA</span>
            </figcaption>
          </Reveal>

          <Reveal delay={0.06} className="forge-authority-copy">
            <span>ARQUITETURA • COPY • IA • PUBLICAÇÃO</span>
            <h3>O PROCESSO FOI ORGANIZADO POR QUEM PRECISAVA USÁ-LO NA PRÁTICA.</h3>
            <p>
              O LAND-IA reúne estratégia, construção com IA, domínio próprio e mensuração em uma execução guiada. O objetivo não é ensinar você a apertar botões: é ajudar a transformar uma oferta em uma página que conduz o lead até a decisão.
            </p>
            <p>
              É o raciocínio aplicado nas páginas que você acabou de ver — traduzido para quem quer criar para o próprio negócio ou começar a entregar landing pages como serviço.
            </p>
            <ul>
              <li><Check aria-hidden="true" /> Estratégia antes do layout</li>
              <li><Check aria-hidden="true" /> Execução sem depender de código</li>
              <li><Check aria-hidden="true" /> Página, checkout e tracking no mesmo caminho</li>
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="forge-authority-evidence">
            <figure className="forge-evidence-card forge-evidence-result">
              <Picture
                avif={authorResultAvif}
                webp={authorResultWebp}
                alt="Registro de campanha do criador com 761 compras, R$ 42.427,49 em valor de conversão e ROAS de 3,72"
                width={720}
                height={703}
              />
              <figcaption>
                <span>APLICAÇÃO PRÓPRIA</span>
                <strong>761 compras registradas • ROAS 3,72</strong>
              </figcaption>
            </figure>

            <figure className="forge-evidence-card forge-evidence-message">
              <Picture
                avif={serviceProofAvif}
                webp={serviceProofWebp}
                alt="Relato recebido sobre a transformação do aprendizado com IA em serviço"
                width={640}
                height={912}
              />
              <figcaption>
                <span>APLICAÇÃO EM SERVIÇO</span>
                <strong>Da teoria para uma oportunidade real com IA.</strong>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal className="forge-authority-disclaimer">
          Registros reais do criador e de aplicação de materiais com IA. Resultados individuais variam conforme oferta, execução, mercado e aquisição de clientes.
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   05 — MECANISMO / DEMONSTRAÇÃO VISUAL
   ================================================================ */
function Mechanism() {
  return (
    <section className="forge-mechanism forge-bridge landia-cv-mechanism">
      <div className="forge-shell">
        <div className="forge-bridge-grid">
          <Reveal className="forge-bridge-heading">
            <SectionTag index="05" light>ENGENHARIA REVERSA DA CONVERSÃO™</SectionTag>
            <h2>BONITA POR FORA.<span>ESTRATÉGICA<br />POR DENTRO.</span></h2>
            <p>O LAND-IA começa pela <strong>decisão de compra</strong> e organiza o caminho até ela. Depois, a IA constrói.</p>
          </Reveal>

          <Reveal as="figure" className="forge-bridge-art">
            <div className="forge-bridge-orbit" aria-hidden="true" />
            <span className="forge-bridge-art-label">O RESULTADO TEM UMA ESTRUTURA.</span>
            <div className="forge-bridge-phone forge-bridge-phone-back">
              <Picture avif={vozDeMarcaAvif} webp={vozDeMarcaWebp} width={720} height={1518} alt="Exemplo de landing page da Voz de Marca, com promessa e identidade visual definidas" />
            </div>
            <div className="forge-bridge-phone forge-bridge-phone-front">
              <Picture avif={nexoAvif} webp={nexoWebp} width={720} height={1518} alt="Exemplo de landing page da Nexo CRM, com apresentação da oferta e chamada para ação" />
            </div>
            <span className="forge-bridge-callout forge-bridge-callout-promise"><i aria-hidden="true" />Promessa clara</span>
            <span className="forge-bridge-callout forge-bridge-callout-proof"><i aria-hidden="true" />Prova visível</span>
            <span className="forge-bridge-callout forge-bridge-callout-offer"><Check aria-hidden="true" />Oferta com valor</span>
            <figcaption>O VISUAL CHAMA A ATENÇÃO.<br /><strong>A ESTRATÉGIA DÁ O PRÓXIMO PASSO.</strong></figcaption>
          </Reveal>

          <Reveal as="ol" className="forge-bridge-steps">
            <li><span>01</span><div><h3>A oferta vem primeiro.</h3><p>Defina por que alguém deveria comprar.</p></div></li>
            <li><span>02</span><div><h3>Os prompts dão a direção.</h3><p>A IA recebe estratégia, copy e estrutura.</p></div></li>
            <li><span>03</span><div><h3>Sua página ganha forma.</h3><p>Revise, ajuste e publique com o método.</p></div></li>
          </Reveal>
        </div>

        <Reveal className="forge-section-cta forge-bridge-cta">
          <div><span>DIREÇÃO ANTES DE CONSTRUÇÃO</span><p>Um caminho pronto para a sua próxima página.</p></div>
          <CTAButton variant="white">QUERO CRIAR COM ESSE MÉTODO</CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   06 — PRODUTO / KIT DIGITAL
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
    <section className="forge-product forge-kit landia-cv-product">
      <div className="forge-shell">
        <Reveal className="forge-kit-heading">
          <SectionTag index="06">O PRODUTO</SectionTag>
          <h2>O MÉTODO COMPLETO.<span>PRONTO PARA VOCÊ APLICAR.</span></h2>
          <p>Prompts na ordem certa e aulas mostrando cada passo — até a página publicada.</p>
        </Reveal>

        <div className="forge-kit-grid">
          <Reveal as="figure" className="forge-kit-visual">
            <picture className="forge-kit-image">
              <source type="image/avif" srcSet={`${kitAvif640} 640w, ${kitAvif1280} 1280w`} sizes="(min-width: 1000px) 650px, (min-width: 761px) 85vw, calc(100vw - 32px)" />
              <img
                src={kitWebp640}
                srcSet={`${kitWebp640} 640w, ${kitWebp1280} 1280w`}
                sizes="(min-width: 1000px) 650px, (min-width: 761px) 85vw, calc(100vw - 32px)"
                alt="Mockup do kit digital Land-IA: coleção de prompts, aulas em vídeo e materiais de apoio para criar landing pages"
                width={1280}
                height={853}
                loading="lazy"
                decoding="async"
                fetchPriority="low"
              />
            </picture>
            <figcaption><span aria-hidden="true" />KIT 100% DIGITAL <i /> PROMPTS + AULAS</figcaption>
          </Reveal>

          <Reveal as="ul" className="forge-kit-includes">
            <li><span aria-hidden="true">01</span><div><h3>Prompts na ordem certa.</h3><p>Copie, adapte à sua oferta e entregue direção à IA.</p></div></li>
            <li><span aria-hidden="true">02</span><div><h3>Aulas para ver e aplicar.</h3><p>Veja na tela como transformar cada prompt em execução.</p></div></li>
            <li><span aria-hidden="true">03</span><div><h3>Da ideia à publicação.</h3><p>Oferta, copy, design, revisão, mobile e domínio próprio.</p></div></li>
          </Reveal>
        </div>

        <details className="forge-kit-details">
          <summary><span>Ver o conteúdo das 7 etapas</span><span className="forge-kit-details-plus" aria-hidden="true">+</span></summary>
          <ol className="forge-kit-curriculum">
            {LESSONS.map(([n, title, text]) => (
              <li key={n}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></li>
            ))}
          </ol>
        </details>

        <RevealGroup className="forge-kit-bonuses">
          <article data-reveal="" className="forge-kit-bonus">
            <div className="forge-kit-cover forge-kit-cover-library" aria-hidden="true"><span>LAND-IA</span><strong>PROMPTS<br />PARA IR<br />ALÉM.</strong><i>01</i></div>
            <div><span className="forge-kit-bonus-label">BÔNUS 01 · PDF</span><h3>Biblioteca <span>Land-IA</span></h3><p>Prompts extras para adaptar, revisar e refinar suas páginas.</p></div>
          </article>
          <article data-reveal="" style={stepDelay(1)} className="forge-kit-bonus">
            <div className="forge-kit-cover forge-kit-cover-invisible" aria-hidden="true"><span>LAND-IA</span><strong>LANDING<br />INVISÍVEL.</strong><i>02</i></div>
            <div><span className="forge-kit-bonus-label">BÔNUS 02 · E-BOOK</span><h3>Landing Invisível</h3><p>O guia de velocidade, rastreamento e publicação.</p></div>
          </article>
        </RevealGroup>

        <Reveal className="forge-kit-close">
          <div><span>UM MÉTODO. NOVAS POSSIBILIDADES.</span><h3>PARA A SUA OFERTA.<br /><strong>OU SEU PRÓXIMO CLIENTE.</strong></h3></div>
          <CTAButton variant="lime">QUERO O KIT COMPLETO — R$ 47</CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   07 — OFERTA / VIEWCONTENT
   ================================================================ */
function Offer() {
  const offerViewTriggerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const trigger = offerViewTriggerRef.current;

    if (!trigger || viewContentSent) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || viewContentSent) return;

        viewContentSent = true;
        observer.disconnect();
        sendFacebookEvent("ViewContent", {
          content_name: "LAND-IA",
          content_type: "product",
          value: 47,
          currency: "BRL",
        });
      },
      {
        // O marcador precisa entrar nos 80% superiores da viewport. Assim o
        // evento só acontece quando a oferta realmente começa a ser vista.
        rootMargin: "0px 0px -20% 0px",
        threshold: 0,
      },
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="oferta" className="forge-offer landia-cv-offer">
      <span ref={offerViewTriggerRef} className="forge-offer-view-trigger" aria-hidden="true" />
      <div className="forge-offer-signal" aria-hidden="true">47</div>
      <div className="forge-shell forge-offer-grid">
        <Reveal className="forge-offer-copy">
          <SectionTag index="07">A OFERTA</SectionTag>
          <h2>POTENCIALIZE SUA OFERTA NA INTERNET.<br /><span>DOMINE E REUTILIZE O PROCESSO POR R$ 47.</span></h2>
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
          <div className="forge-guarantee">
            <strong>7 DIAS</strong>
            <span>para acessar, conhecer o método e solicitar reembolso pela Hotmart caso não faça sentido para você.</span>
          </div>
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
          <h2>SUA PRÓXIMA LANDING PODE SER OUTRO STRESS.<br /><span>OU O COMEÇO DO SEU LUCRO.</span></h2>
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

        <SectionCTA eyebrow="ESCOLHA O TERCEIRO CAMINHO" button="QUERO DOMINAR O PROCESSO — R$ 47" variant="ink">
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

        <Reveal className="forge-not-for">
          <div>
            <span>ANTES DE ENTRAR</span>
            <h3>O LAND-IA NÃO É PARA QUEM PROCURA UM BOTÃO MÁGICO.</h3>
          </div>
          <ul>
            <li><span>01</span>Não quer tomar decisões sobre a própria oferta.</li>
            <li><span>02</span>Espera conversão garantida sem testar, revisar ou executar.</li>
            <li><span>03</span>Busca uma página pronta sem aprender um processo reutilizável.</li>
          </ul>
        </Reveal>

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
          <h3>PODE TRANSFORMAR IA GRATUITA EM PÁGINAS PARA VOCÊ</h3>
          <p>
            Use nas suas ofertas, economize terceirização ou transforme a habilidade em um serviço que você pode oferecer.
          </p>
          <CTAButton variant="ink">QUERO PARAR DE DEPENDER — R$ 47</CTAButton>
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
          <small>Acesso imediato • pagamento único • garantia de 7 dias</small>
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
