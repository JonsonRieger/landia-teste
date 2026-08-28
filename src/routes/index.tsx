import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Lock, ShieldCheck, Sparkles } from "lucide-react";
import LandiaVSL from "@/components/LandiaVSL";
import { Reveal, RevealGroup, stepDelay } from "@/components/Reveal";

import phoneAiWebp from "@/assets/hero/landia-phone-ai-saas.webp";
import phoneArchitectureWebp from "@/assets/hero/landia-phone-architecture.webp";
import phoneEcommerceWebp from "@/assets/hero/landia-phone-ecommerce.webp";
import phoneWellnessWebp from "@/assets/hero/landia-phone-wellness.webp";

import authorPhotoAvif from "@/assets/author-photo-720.avif";
import authorPhotoWebp from "@/assets/author-photo-720.webp";
import briefingAvif from "@/assets/proof/briefing.avif";
import briefingWebp from "@/assets/proof/briefing.webp";
import promptMasterAvif from "@/assets/proof/prompt-master.avif";
import promptMasterWebp from "@/assets/proof/prompt-master.webp";
import lovableBuildAvif from "@/assets/proof/lovable-build.avif";
import lovableBuildWebp from "@/assets/proof/lovable-build.webp";
import pageSpeedAvif from "@/assets/proof/pagespeed.avif";
import pageSpeedWebp from "@/assets/proof/pagespeed.webp";

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
          "Pare de pagar por cada nova landing. Aprenda um processo prático com ChatGPT + Lovable para estruturar, construir e publicar páginas no seu próprio domínio — sem programar.",
      },
      { name: "theme-color", content: "#0B0D10" },
      {
        property: "og:title",
        content: "Land-IA | Sua próxima landing pode ser uma habilidade sua",
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
      { property: "og:image:secure_url", content: "https://www.metamove.online/og-landia-v2.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Land-IA — Landing Pages com IA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Land-IA | Crie Landing Pages Profissionais com IA" },
      {
        name: "twitter:description",
        content: "Um processo prático para estruturar, construir e publicar landing pages com IA.",
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
  href = CHECKOUT_URL,
  variant = "orange",
  className = "",
  trackingLabel,
}: {
  children?: ReactNode;
  href?: string;
  variant?: "orange" | "lime" | "ink" | "white";
  className?: string;
  trackingLabel: string;
}) {
  const isCheckout = href.includes("hotmart.com");
  const isExternal = href.startsWith("http");
  const shouldOpenNewTab = isExternal && !isCheckout;

  return (
    <a
      href={href}
      target={shouldOpenNewTab ? "_blank" : undefined}
      rel={shouldOpenNewTab ? "noopener noreferrer" : undefined}
      onClick={(event) => {
        if (isCheckout) {
          trackCheckoutClick(trackingLabel);
          return;
        }

        if (href.startsWith("#")) {
          const target = document.getElementById(href.slice(1));
          if (target) {
            event.preventDefault();
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
      <ProcessProof />
      <Mechanism />
      <Product />
      <Offer />
      <Authority />
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
          <strong>PARE DE PAGAR POR CADA NOVA LANDING</strong>
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
        <span>UM PROCESSO</span>
        <b>DIREÇÕES INFINITAS</b>
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
    <section className="forge-hero">
      <div className="forge-hero-orbit" aria-hidden="true" />
      <div className="forge-shell forge-hero-grid">
        <div className="forge-hero-copy">
          <div data-enter="" className="forge-hero-kicker">
            <span /> MÉTODO PRÁTICO • ZERO PROGRAMAÇÃO
          </div>

          <h1>
            <span>PARE DE PAGAR POR</span>
            <span className="forge-outline-word">CADA LANDING.</span>
            <span className="forge-lime-line">CRIE COM IA.</span>
            <span className="forge-lime-line">NO SEU DOMÍNIO.</span>
          </h1>

          <p className="forge-hero-lead">
            Um processo completo com <strong>ChatGPT + Lovable</strong> para estruturar, construir e
            publicar landing pages profissionais — sem precisar programar e começando com
            ferramentas gratuitas.
          </p>

          <p className="forge-hero-secondary">
            Primeiro, use nas suas ofertas. Depois, se quiser, transforme a mesma habilidade em um
            serviço para clientes.
          </p>

          <div className="forge-hero-actions">
            <CTAButton variant="lime" trackingLabel="hero" />
          </div>

          <div className="landia-trust-strip" aria-label="Condições da oferta">
            <span>
              <Check aria-hidden="true" /> PAGAMENTO ÚNICO
            </span>
            <span>
              <Check aria-hidden="true" /> ACESSO IMEDIATO
            </span>
            <span>
              <ShieldCheck aria-hidden="true" /> 7 DIAS DE GARANTIA
            </span>
          </div>

          <div className="forge-tool-line" aria-label="Fluxo de ferramentas">
            {["CHATGPT", "LOVABLE", "GITHUB", "VERCEL", "SEU DOMÍNIO"].map((tool, index) => (
              <span key={tool}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                {tool}
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

function VslLeadIn() {
  return (
    <section id="vsl" className="forge-vsl-intro">
      <div className="forge-shell">
        <Reveal className="forge-vsl-title-row">
          <SectionTag index="02">VEJA O PROCESSO</SectionTag>
          <div>
            <h2>DO BRIEFING À PÁGINA PUBLICADA.</h2>
            <p>
              Em 5 minutos, veja por que o Land-IA não é apenas um prompt: é o caminho entre uma
              ideia solta e uma landing pronta para entrar no ar.
            </p>
          </div>
          <span className="forge-play-index">05:17</span>
        </Reveal>
      </div>
    </section>
  );
}

const PROCESS_STEPS = [
  {
    number: "01",
    title: "BRIEFING ESTRATÉGICO",
    text: "A oferta, a persona e a decisão final são organizadas antes de abrir o construtor.",
    avif: briefingAvif,
    webp: briefingWebp,
    width: 720,
    height: 763,
  },
  {
    number: "02",
    title: "PROMPT MESTRE",
    text: "Estratégia, copy, hierarquia e direção visual viram uma instrução completa.",
    avif: promptMasterAvif,
    webp: promptMasterWebp,
    width: 720,
    height: 894,
  },
  {
    number: "03",
    title: "CONSTRUÇÃO COM IA",
    text: "O projeto é executado e ajustado no Lovable sem recomeçar a cada correção.",
    avif: lovableBuildAvif,
    webp: lovableBuildWebp,
    width: 720,
    height: 689,
  },
  {
    number: "04",
    title: "AUDITORIA E PUBLICAÇÃO",
    text: "Mobile, performance, tracking e domínio próprio entram na revisão final.",
    avif: pageSpeedAvif,
    webp: pageSpeedWebp,
    width: 720,
    height: 664,
  },
];

function ProcessProof() {
  return (
    <section className="landia-process-proof landia-cv-proofs">
      <div className="forge-shell">
        <Reveal className="landia-process-head">
          <SectionTag index="03">PROVA DO PROCESSO</SectionTag>
          <div>
            <h2>
              NÃO É SÓ UM PROMPT.
              <br />
              <span>É O CAMINHO INTEIRO, NA TELA.</span>
            </h2>
            <p>
              Estas são etapas reais do processo usado para transformar um briefing em uma landing
              construída, revisada e pronta para publicar.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="landia-process-grid">
          {PROCESS_STEPS.map((step, index) => (
            <article
              key={step.title}
              data-reveal=""
              style={stepDelay(index)}
              className="landia-process-card"
            >
              <div className="landia-process-image">
                <Picture
                  avif={step.avif}
                  webp={step.webp}
                  alt={`${step.title} aplicado na criação de uma landing page com o Land-IA`}
                  width={step.width}
                  height={step.height}
                />
              </div>
              <div className="landia-process-copy">
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            </article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

const REVERSE_CHAIN = [
  ["01", "DECIDA", "Defina a transformação, a oferta e a ação que o visitante precisa tomar."],
  ["02", "INSTRUA", "Concentre estratégia, copy e direção visual em um Prompt Mestre completo."],
  [
    "03",
    "CONSTRUA E PUBLIQUE",
    "Execute com IA, revise no mobile e leve a página para seu domínio.",
  ],
];

function Mechanism() {
  return (
    <section className="forge-mechanism landia-cv-mechanism">
      <div className="forge-shell">
        <Reveal className="forge-mechanism-head">
          <SectionTag index="04" light>
            ENGENHARIA REVERSA DA CONVERSÃO™
          </SectionTag>
          <h2>
            COMECE PELO FIM.
            <br />
            <span>CONSTRUA O CAMINHO.</span>
          </h2>
          <p>
            <mark className="forge-mark forge-mark-orange">
              Página profissional começa antes do design.
            </mark>{" "}
            Você define a decisão final e trabalha de trás para frente até a promessa que prende a
            atenção.
          </p>
        </Reveal>

        <RevealGroup className="forge-reverse-chain landia-reverse-chain">
          {REVERSE_CHAIN.map(([number, title, text], index) => (
            <div
              data-reveal=""
              style={stepDelay(index)}
              className={`forge-reverse-row forge-reverse-row-${index}`}
              key={title}
            >
              <span className="forge-reverse-number">{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
              <span className="forge-reverse-arrow">→</span>
            </div>
          ))}
        </RevealGroup>

        <Reveal className="forge-mechanism-rule">
          <span>ARQUITETURA ANTES DA IA.</span>
          <strong>Você deixa de pedir ideias e começa a entregar direção.</strong>
        </Reveal>
      </div>
    </section>
  );
}

const LESSONS = [
  [
    "01",
    "ANTES DE ABRIR A IA",
    "Entenda por que beleza, sozinha, não cria uma jornada de decisão.",
  ],
  ["02", "ENGENHARIA REVERSA", "Construa a página começando pela ação final do visitante."],
  ["03", "O PROMPT MESTRE", "Transforme oferta, copy e direção visual em uma instrução completa."],
  [
    "04",
    "CONSTRUINDO COM IA",
    "Leve o Prompt Mestre ao Lovable e ajuste sem destruir o que já funciona.",
  ],
  ["05", "DE BONITA PARA PRONTA", "Audite hierarquia, clareza e experiência antes de publicar."],
  ["06", "CHECKOUT + MOBILE", "Revise CTAs, links, responsividade e a jornada no celular."],
  ["07", "SEU PRÓPRIO DOMÍNIO", "Passe por Lovable → GitHub → Vercel → DNS → domínio."],
];

function Product() {
  return (
    <section className="forge-product landia-cv-product">
      <div className="forge-shell">
        <Reveal className="forge-product-head">
          <SectionTag index="05">O QUE VOCÊ RECEBE</SectionTag>
          <div>
            <h2>DA ESTRATÉGIA À PÁGINA PUBLICADA — SEM PROGRAMAR.</h2>
            <p>
              Sete aulas práticas e dois materiais de apoio para você criar páginas para as próprias
              ofertas. Se quiser, o mesmo processo também pode virar um serviço.
            </p>
          </div>
        </Reveal>

        <Reveal className="landia-product-facts">
          <span>
            <strong>7</strong> AULAS PRÁTICAS
          </span>
          <span>
            <strong>2</strong> BÔNUS REUTILIZÁVEIS
          </span>
          <span>
            <strong>1</strong> PROCESSO COMPLETO
          </span>
          <span>
            <strong>0</strong> PROGRAMAÇÃO
          </span>
        </Reveal>

        <div className="forge-product-grid">
          <Reveal className="forge-product-spine">
            <span className="forge-product-vertical">LAND-IA / IMPLEMENTAÇÃO GUIADA</span>
            <div className="forge-product-screen">
              <div className="forge-product-screen-top">
                <span>LESSON 04</span>
                <b>BUILD MODE</b>
              </div>
              <div className="forge-product-screen-body">
                <small>DA ARQUITETURA PARA A TELA</small>
                <h3>
                  CONSTRUA.
                  <br />
                  REVISE.
                  <br />
                  <span>PUBLIQUE.</span>
                </h3>
                <div className="forge-product-progress">
                  <i />
                </div>
                <div className="forge-product-screen-meta">
                  <span>GRAVAÇÃO DE TELA</span>
                  <span>EXECUÇÃO REAL</span>
                </div>
              </div>
            </div>
          </Reveal>

          <RevealGroup className="forge-curriculum">
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
        </div>

        <RevealGroup className="forge-bonus-grid">
          <article data-reveal="" className="forge-bonus forge-bonus-light">
            <span>BÔNUS 01 / PDF</span>
            <h3>BIBLIOTECA LAND-IA</h3>
            <p>
              Prompts operacionais para persona, oferta, mecanismo, hero, provas, objeções, FAQ,
              CTA, auditoria, mobile e correções cirúrgicas.
            </p>
            <strong>Não comece cada página do zero.</strong>
          </article>
          <article data-reveal="" style={stepDelay(1)} className="forge-bonus forge-bonus-dark">
            <span>BÔNUS 02 / E-BOOK</span>
            <h3>LANDING INVISÍVEL</h3>
            <p>
              Performance, WebP/AVIF, LCP, CLS, tracking, Pixel, CAPI, deduplicação, metadata,
              Vercel e troubleshooting.
            </p>
            <strong>A parte que o visitante não vê — mas o navegador vê.</strong>
          </article>
        </RevealGroup>
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
    ["LAND-IA", "7 aulas práticas: estratégia, construção, mobile e publicação"],
    ["BIBLIOTECA LAND-IA", "Prompts e estruturas para reutilizar nas próximas páginas"],
    ["LANDING INVISÍVEL", "Performance, tracking e infraestrutura sem complicação"],
    ["CAMINHO PARA DOMÍNIO PRÓPRIO", "Lovable, GitHub, Vercel e DNS explicados na prática"],
  ];

  return (
    <section ref={offerRef} id="oferta" className="forge-offer landia-cv-offer">
      <div className="forge-offer-signal" aria-hidden="true">
        47
      </div>
      <div className="forge-shell forge-offer-grid">
        <Reveal className="forge-offer-copy">
          <SectionTag index="06">A OFERTA</SectionTag>
          <h2>
            FAÇA DA PRÓXIMA LANDING.
            <br />
            <span>UMA HABILIDADE SUA.</span>
          </h2>
          <p>
            Em vez de pagar novamente por cada ideia, você recebe o processo completo para
            estruturar, construir, revisar e publicar suas próprias páginas.
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
            <span>ACESSO IMEDIATO • PAGAMENTO ÚNICO</span>
          </div>
          <div className="forge-price-main">
            <span>INVESTIMENTO</span>
            <strong>
              <small>R$</small>47
            </strong>
          </div>
          <p>Ou em até 12x de R$ 4,86 no checkout.*</p>
          <CTAButton className="w-full" variant="orange" trackingLabel="offer" />
          <div className="landia-price-assurance">
            <span>
              <ShieldCheck aria-hidden="true" /> 7 dias de garantia
            </span>
            <span>
              <Lock aria-hidden="true" /> Compra processada pela Hotmart
            </span>
          </div>
          <small className="landia-installment-note">*Parcelamento possui acréscimo.</small>
        </Reveal>
      </div>
    </section>
  );
}

function Authority() {
  return (
    <section className="landia-authority landia-cv-authority">
      <div className="forge-shell landia-authority-grid">
        <Reveal className="landia-authority-photo">
          <Picture
            avif={authorPhotoAvif}
            webp={authorPhotoWebp}
            alt="Hebrithan Rieger, criador do Land-IA"
            width={720}
            height={960}
          />
          <div>
            <strong>HEBRITHAN RIEGER</strong>
            <span>CRIADOR DO LAND-IA</span>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="landia-authority-copy">
          <SectionTag index="07">QUEM CONSTRUIU O MÉTODO</SectionTag>
          <h2>
            SEM FÓRMULA MÁGICA.
            <br />
            <span>UM PROCESSO QUE VOCÊ CONSEGUE REPETIR.</span>
          </h2>
          <p>
            Eu criei o Land-IA para organizar o que normalmente fica espalhado entre prompts,
            ferramentas e tentativas: a estratégia da oferta, a direção visual, a construção, a
            revisão e a publicação.
          </p>
          <p>
            Não vou prometer que qualquer página vai converter. O que você recebe é um método para
            tomar decisões melhores antes de pedir que a IA execute — e para sair com uma página
            profissional que você consegue revisar e publicar.
          </p>
          <div className="landia-authority-points">
            <span>
              <Check aria-hidden="true" /> Aplicação prática, na tela
            </span>
            <span>
              <Check aria-hidden="true" /> Sem exigir programação
            </span>
            <span>
              <Check aria-hidden="true" /> Da estratégia ao domínio próprio
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="forge-final landia-cv-final">
      <div className="forge-final-ring" aria-hidden="true" />
      <div className="forge-shell forge-final-inner">
        <Reveal>
          <span className="forge-final-code">LAND-IA / READY TO BUILD</span>
          <h2>
            SUA PRÓXIMA LANDING PODE SER
            <br />
            <span>UMA HABILIDADE SUA.</span>
          </h2>
          <p>
            Estruture, construa e publique com IA — sem programar e sem pagar por cada nova página.
          </p>
          <CTAButton variant="orange" trackingLabel="final" />
          <small>Pagamento único • acesso imediato • 7 dias de garantia</small>
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
