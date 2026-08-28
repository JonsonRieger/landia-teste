import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Lock, ShieldCheck, Sparkles } from "lucide-react";
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
      { title: "Land-IA | Crie Landing Pages Profissionais com IA" },
      {
        name: "description",
        content:
          "Aprenda um processo prático com ChatGPT + Lovable para criar landing pages profissionais, publicar no seu domínio e usar nas suas ofertas ou em projetos para clientes.",
      },
      { name: "theme-color", content: "#0B0D10" },
      {
        property: "og:title",
        content: "Land-IA | Landing pages profissionais criadas por você",
      },
      {
        property: "og:description",
        content:
          "Estratégia, construção e publicação com ChatGPT + Lovable — sem precisar programar.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.metamove.online/" },
      { property: "og:site_name", content: "Land-IA" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://www.metamove.online/og-landia-v2.jpg" },
      {
        property: "og:image:secure_url",
        content: "https://www.metamove.online/og-landia-v2.jpg",
      },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Land-IA — Landing Pages com IA" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Land-IA | Crie Landing Pages Profissionais com IA",
      },
      {
        name: "twitter:description",
        content: "Um processo prático para criar e publicar landing pages com IA.",
      },
      { name: "twitter:image", content: "https://www.metamove.online/og-landia-v2.jpg" },
      { name: "twitter:image:alt", content: "Land-IA — Landing Pages com IA" },
    ],
    links: [{ rel: "canonical", href: "https://www.metamove.online/" }],
  }),
});

type TrackingData = Record<string, string | number | boolean>;

function sendFacebookEvent(
  eventName: string,
  customData: TrackingData = {},
  isCustomEvent = false,
) {
  try {
    const eventId = crypto.randomUUID();
    const fbp = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("_fbp="))
      ?.split("=")[1];
    const fbc = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("_fbc="))
      ?.split("=")[1];

    void fetch("https://metamove-capi.hebrithan.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: window.location.href,
        user_agent: navigator.userAgent,
        fbp,
        fbc,
        custom_data: customData,
      }),
    }).catch((error) => {
      console.error(`Erro ao enviar ${eventName} via CAPI:`, error);
    });

    if (typeof window.fbq === "function") {
      window.fbq(isCustomEvent ? "trackCustom" : "track", eventName, customData, {
        eventID: eventId,
      });
    }
  } catch (error) {
    console.error(`Erro ao rastrear ${eventName}:`, error);
  }
}

const CHECKOUT_URL = "https://pay.hotmart.com/Y107168906J?checkoutMode=10&bid=1786752624031";

function trackCheckoutClick(position: string) {
  const data = {
    content_name: "Land-IA",
    content_type: "product",
    cta_position: position,
    value: 47,
    currency: "BRL",
  };

  sendFacebookEvent("CheckoutClick", data, true);
  sendFacebookEvent("InitiateCheckout", data);
}

function CTAButton({
  children = "QUERO ACESSAR O LAND-IA — R$ 47",
  variant = "orange",
  className = "",
  trackingLabel,
}: {
  children?: ReactNode;
  variant?: "orange" | "lime" | "ink" | "white";
  className?: string;
  trackingLabel: string;
}) {
  return (
    <a
      href={CHECKOUT_URL}
      onClick={() => trackCheckoutClick(trackingLabel)}
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
}: {
  avif: string;
  webp: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <picture>
      <source srcSet={avif} type="image/avif" />
      <img src={webp} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </picture>
  );
}

function SectionTag({
  index,
  children,
  light = false,
}: {
  index: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`forge-tag ${light ? "forge-tag-light" : ""}`}>
      <span>{index}</span>
      <i />
      <strong>{children}</strong>
    </div>
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
      { rootMargin: "1400px 0px" },
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
      sendFacebookEvent("TimeOnPage", { seconds: 30 }, true);
    }, 30000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="forge-page min-h-screen bg-[var(--carbon)] text-white antialiased">
      <OfferRail />
      <Hero />
      <VslLeadIn />
      <LandiaVSL />
      <Proofs />
      <Product />
      <Offer />
      <DeferredFAQ />
      <FinalCTA />
      <Footer />
      <MobileCheckoutBar />
    </main>
  );
}

function OfferRail() {
  return (
    <div className="forge-offer-rail">
      <div className="forge-shell forge-offer-rail-inner">
        <div className="forge-urgency-message">
          <span className="forge-urgency-pulse" aria-hidden="true" />
          <strong>CRIE LANDING PAGES PROFISSIONAIS COM IA</strong>
          <span>ACESSO IMEDIATO</span>
        </div>
        <div className="forge-offer-price">
          <span>PAGAMENTO ÚNICO</span>
          <strong>R$ 47</strong>
        </div>
      </div>
    </div>
  );
}

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
        <span>UM MÉTODO</span>
        <b>DIREÇÕES DIFERENTES</b>
      </div>

      {HERO_PAGES.map(([src, label, alt], index) => {
        const isLcpImage = index === 1;

        return (
          <figure key={String(label)} className={`forge-phone-card forge-phone-card-${index + 1}`}>
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
    <section className="forge-hero landia-compact-hero">
      <div className="forge-hero-orbit" aria-hidden="true" />
      <div className="forge-shell forge-hero-grid">
        <div className="forge-hero-copy">
          <div data-enter="" className="forge-hero-kicker">
            <span /> PARA SUAS OFERTAS OU PARA ENTREGAR A CLIENTES
          </div>

          <h1>
            <span>CRIE LANDING PAGES</span>
            <span className="forge-outline-word">PROFISSIONAIS.</span>
            <span className="forge-lime-line">COM IA.</span>
            <span className="forge-lime-line">SEM PROGRAMAR.</span>
          </h1>

          <p className="forge-hero-lead">
            Aprenda um processo prático com <strong>ChatGPT + Lovable</strong> para estruturar,
            construir e publicar páginas no seu domínio — sem depender de designer a cada nova
            oferta.
          </p>

          <div className="forge-hero-actions">
            <CTAButton variant="lime" trackingLabel="hero" />
          </div>

          <div className="landia-hero-trust" aria-label="Resumo da oferta">
            <span>
              <Check aria-hidden="true" /> PAGAMENTO ÚNICO
            </span>
            <span>
              <Check aria-hidden="true" /> ACESSO IMEDIATO
            </span>
            <span>
              <Check aria-hidden="true" /> COMEÇANDO COM FERRAMENTAS GRATUITAS
            </span>
          </div>
        </div>

        <HeroBuildVisual />
      </div>

      <div className="forge-hero-footer">
        <span>ARQUITETURA ANTES DA IA.</span>
        <i />
        <span>ESTRUTURE → CONSTRUA → REVISE → PUBLIQUE</span>
      </div>
    </section>
  );
}

function VslLeadIn() {
  return (
    <section id="vsl" className="forge-vsl-intro landia-compact-vsl-intro">
      <div className="forge-shell">
        <Reveal className="forge-vsl-title-row">
          <SectionTag index="02">VEJA ANTES DE DECIDIR</SectionTag>
          <div>
            <h2>VEJA COMO A IDEIA VIRA UMA PÁGINA PRONTA.</h2>
            <p>
              Em 5 minutos, entenda a proposta do Land-IA e o que muda quando a IA recebe direção em
              vez de um pedido genérico.
            </p>
          </div>
          <span className="forge-play-index">05:17</span>
        </Reveal>
      </div>
    </section>
  );
}

const SHOWCASE_PAGES = [
  {
    avif: luminaAvif,
    webp: luminaWebp,
    brand: "LUMINA PRIME",
    niche: "Estética premium",
    goal: "Agendamento",
    height: 1518,
  },
  {
    avif: nexoAvif,
    webp: nexoWebp,
    brand: "NEXO CRM",
    niche: "SaaS B2B",
    goal: "Demonstração",
    height: 1518,
  },
  {
    avif: brasaAvif,
    webp: brasaWebp,
    brand: "BRASA 47",
    niche: "Gastronomia",
    goal: "Reserva",
    height: 1518,
  },
  {
    avif: verticeAvif,
    webp: verticeWebp,
    brand: "VÉRTICE",
    niche: "Imóveis de luxo",
    goal: "Contato",
    height: 1518,
  },
  {
    avif: raizBotanicaAvif,
    webp: raizBotanicaWebp,
    brand: "RAIZ BOTÂNICA",
    niche: "Cosméticos",
    goal: "Compra",
    height: 1518,
  },
  {
    avif: ramosValeAvif,
    webp: ramosValeWebp,
    brand: "RAMOS & VALE",
    niche: "Advocacia",
    goal: "Consulta",
    height: 1518,
  },
  {
    avif: formaLabAvif,
    webp: formaLabWebp,
    brand: "FORMA LAB",
    niche: "Fitness",
    goal: "Avaliação",
    height: 1518,
  },
  {
    avif: almaLeveAvif,
    webp: almaLeveWebp,
    brand: "ALMA LEVE",
    niche: "Psicoterapia",
    goal: "Conversa",
    height: 1518,
  },
  {
    avif: vozDeMarcaAvif,
    webp: vozDeMarcaWebp,
    brand: "VOZ DE MARCA",
    niche: "Infoproduto",
    goal: "Inscrição",
    height: 1518,
  },
  {
    avif: norteCapitalAvif,
    webp: norteCapitalWebp,
    brand: "NORTE CAPITAL",
    niche: "Planejamento financeiro",
    goal: "Consultoria",
    height: 1518,
  },
];

function Proofs() {
  return (
    <section className="forge-showcase landia-compact-showcase landia-cv-proofs">
      <div className="forge-shell">
        <Reveal className="forge-showcase-head">
          <SectionTag index="03">PÁGINAS CRIADAS COM O MÉTODO</SectionTag>
          <h2>
            10 MERCADOS. 10 DIREÇÕES.
            <span>NENHUMA CARA DE TEMPLATE.</span>
          </h2>
          <p>Arraste para ver todas as páginas.</p>
        </Reveal>
      </div>

      <div
        className="forge-showcase-stage"
        role="region"
        aria-label="Galeria horizontal com 10 landing pages criadas com o Land-IA"
        tabIndex={0}
      >
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
                  <p>
                    {page.niche} <i /> {page.goal}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </RevealGroup>
      </div>

      <div className="forge-shell">
        <Reveal className="landia-showcase-close">
          <div>
            <strong>O OBJETIVO NÃO É APRENDER “MAIS UMA IA”.</strong>
            <p>
              É sair com uma habilidade reutilizável para criar páginas profissionais em ofertas e
              nichos diferentes.
            </p>
          </div>
          <CTAButton variant="lime" trackingLabel="showcase" />
        </Reveal>
      </div>
    </section>
  );
}

const METHOD_STEPS = [
  [
    "01",
    "COMECE PELA DECISÃO",
    "Defina oferta, promessa, provas e a ação final antes de pensar no visual.",
  ],
  [
    "02",
    "DÊ DIREÇÃO À IA",
    "Transforme as decisões em uma instrução completa para reduzir retrabalho e créditos desperdiçados.",
  ],
  [
    "03",
    "CONSTRUA E PUBLIQUE",
    "Execute no Lovable, revise no mobile e leve o projeto ao seu próprio domínio.",
  ],
];

const LESSONS = [
  ["01", "ANTES DE ABRIR A IA", "Clareza antes do design."],
  ["02", "ENGENHARIA REVERSA", "A jornada a partir da decisão final."],
  ["03", "O PROMPT MESTRE", "Estratégia, copy e direção em uma instrução."],
  ["04", "CONSTRUINDO COM IA", "Execução e ajustes no Lovable."],
  ["05", "DE BONITA PARA PRONTA", "Auditoria e correções cirúrgicas."],
  ["06", "CHECKOUT + MOBILE", "CTAs, links e responsividade."],
  ["07", "SEU PRÓPRIO DOMÍNIO", "Lovable → GitHub → Vercel → DNS."],
];

function Product() {
  return (
    <section className="forge-product landia-compact-product landia-cv-product">
      <div className="forge-shell">
        <Reveal className="forge-product-head">
          <SectionTag index="04">MÉTODO + CONTEÚDO</SectionTag>
          <div>
            <h2>UM CAMINHO DIRETO DA OFERTA À PÁGINA PUBLICADA.</h2>
            <p>
              Você aprende o que decidir, como instruir a IA e como transformar a construção em uma
              página funcional — sem precisar programar.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="landia-method-grid">
          {METHOD_STEPS.map(([number, title, text], index) => (
            <article data-reveal="" style={stepDelay(index)} key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </RevealGroup>

        <div className="landia-learning-grid">
          <RevealGroup className="forge-curriculum landia-curriculum-compact">
            {LESSONS.map(([number, title, text], index) => (
              <div data-reveal="" style={stepDelay(index)} className="forge-lesson" key={title}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
                <i />
              </div>
            ))}
          </RevealGroup>

          <RevealGroup className="landia-bonus-stack">
            <article data-reveal="" className="forge-bonus forge-bonus-light">
              <span>BÔNUS 01 / PDF</span>
              <h3>BIBLIOTECA LAND-IA</h3>
              <p>
                Prompts operacionais para persona, oferta, mecanismo, hero, provas, objeções, FAQ,
                CTA, auditoria e mobile.
              </p>
            </article>
            <article data-reveal="" style={stepDelay(1)} className="forge-bonus forge-bonus-dark">
              <span>BÔNUS 02 / E-BOOK</span>
              <h3>LANDING INVISÍVEL</h3>
              <p>Performance, tracking, Pixel, CAPI, metadata, Vercel e troubleshooting.</p>
            </article>
          </RevealGroup>
        </div>

        <Reveal className="landia-use-cases">
          <span>
            <Check aria-hidden="true" /> USE NAS SUAS OFERTAS
          </span>
          <span>
            <Check aria-hidden="true" /> PARE DE PAGAR POR CADA NOVA PÁGINA
          </span>
          <span>
            <Check aria-hidden="true" /> APLIQUE EM PROJETOS PARA CLIENTES
          </span>
        </Reveal>
      </div>
    </section>
  );
}

function Offer() {
  const offerRef = useRef<HTMLElement | null>(null);
  const hasTrackedViewContent = useRef(false);

  useEffect(() => {
    const section = offerRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedViewContent.current) {
          hasTrackedViewContent.current = true;
          sendFacebookEvent("ViewContent", {
            content_name: "Land-IA",
            content_type: "product",
            value: 47,
            currency: "BRL",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const items = [
    ["LAND-IA", "7 aulas práticas do planejamento à publicação"],
    ["BIBLIOTECA LAND-IA", "Prompts e estruturas para reutilizar"],
    ["LANDING INVISÍVEL", "Performance, tracking e infraestrutura"],
    ["PUBLICAÇÃO NO SEU DOMÍNIO", "Lovable, GitHub, Vercel e DNS"],
  ];

  return (
    <section
      ref={offerRef}
      id="oferta"
      className="forge-offer landia-compact-offer landia-cv-offer"
    >
      <div className="forge-offer-signal" aria-hidden="true">
        47
      </div>
      <div className="forge-shell forge-offer-grid">
        <Reveal className="forge-offer-copy">
          <SectionTag index="05">ACESSO AO LAND-IA</SectionTag>
          <h2>
            UMA HABILIDADE REUTILIZÁVEL.
            <br />
            <span>UM PAGAMENTO DE R$ 47.</span>
          </h2>
          <p>
            Receba o treinamento completo e os dois bônus para criar páginas nas suas ofertas ou
            aplicar o mesmo processo em projetos para clientes.
          </p>

          <div className="forge-stack-list landia-stack-list">
            {items.map(([name, description]) => (
              <div key={name}>
                <Check aria-hidden="true" />
                <span>
                  <strong>{name}</strong>
                  <small>{description}</small>
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="forge-price-block">
          <div className="forge-price-top">
            <Sparkles aria-hidden="true" />
            <span>ACESSO IMEDIATO • SEM MENSALIDADE</span>
          </div>
          <div className="forge-price-main">
            <span>PAGAMENTO ÚNICO</span>
            <strong>
              <small>R$</small>47
            </strong>
          </div>
          <p>Ou em até 12x de R$ 4,86 no checkout.*</p>
          <CTAButton className="w-full" variant="orange" trackingLabel="offer" />
          <div className="landia-price-assurance">
            <span>
              <Lock aria-hidden="true" /> Compra processada pela Hotmart
            </span>
            <span>
              <ShieldCheck aria-hidden="true" /> Acesso enviado após a confirmação
            </span>
          </div>
          <small className="landia-installment-note">*Parcelamento possui acréscimo.</small>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="forge-final landia-compact-final landia-cv-final">
      <div className="forge-final-ring" aria-hidden="true" />
      <div className="forge-shell forge-final-inner">
        <Reveal>
          <span className="forge-final-code">LAND-IA / READY TO BUILD</span>
          <h2>
            SUA PRÓXIMA LANDING PODE SER
            <br />
            <span>CRIADA POR VOCÊ.</span>
          </h2>
          <p>Um método direto para estruturar, construir e publicar com IA — sem programar.</p>
          <CTAButton variant="orange" trackingLabel="final" />
          <small>Pagamento único • acesso imediato</small>
        </Reveal>
      </div>
    </section>
  );
}

function MobileCheckoutBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const pageHeight = document.documentElement.scrollHeight;
      const nearEnd = window.scrollY + window.innerHeight > pageHeight - 520;
      setVisible(window.scrollY > 760 && !nearEnd);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <aside
      className={`landia-mobile-cta ${visible ? "is-visible" : ""}`}
      aria-label="Acesso rápido ao Land-IA"
    >
      <div>
        <span>PAGAMENTO ÚNICO</span>
        <strong>R$ 47</strong>
      </div>
      <a href={CHECKOUT_URL} onClick={() => trackCheckoutClick("mobile_sticky")}>
        QUERO ACESSAR <ArrowRight aria-hidden="true" />
      </a>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="forge-footer landia-cv-footer">
      <div className="forge-shell forge-footer-inner">
        <div>
          <span className="forge-brand-mark">L//</span>
          <strong>LAND-IA</strong>
        </div>
        <p>Landing pages com IA • Arquitetura antes da IA.</p>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
