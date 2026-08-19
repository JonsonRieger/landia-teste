import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Lock, Sparkles, X } from "lucide-react";
import LandiaVSL from "@/components/LandiaVSL";
import { Reveal, RevealGroup, stepDelay } from "@/components/Reveal";

import briefingAvif from "@/assets/proof/briefing.avif";
import briefingWebp from "@/assets/proof/briefing.webp";
import promptAvif from "@/assets/proof/prompt-master.avif";
import promptWebp from "@/assets/proof/prompt-master.webp";
import lovablePromptAvif from "@/assets/proof/lovable-prompt.avif";
import lovablePromptWebp from "@/assets/proof/lovable-prompt.webp";
import lovableBuildAvif from "@/assets/proof/lovable-build.avif";
import lovableBuildWebp from "@/assets/proof/lovable-build.webp";
import heroDesktopAvif from "@/assets/proof/example-hero-desktop.avif";
import heroDesktopWebp from "@/assets/proof/example-hero-desktop.webp";
import heroMobileAvif from "@/assets/proof/example-hero-mobile.avif";
import heroMobileWebp from "@/assets/proof/example-hero-mobile.webp";
import sectionTwoAvif from "@/assets/proof/example-section-2.avif";
import sectionTwoWebp from "@/assets/proof/example-section-2.webp";
import sectionThreeAvif from "@/assets/proof/example-section-3.avif";
import sectionThreeWebp from "@/assets/proof/example-section-3.webp";
import pageSpeedAvif from "@/assets/proof/pagespeed.avif";
import pageSpeedWebp from "@/assets/proof/pagespeed.webp";
import nouraAvif from "@/assets/proof/example-noura.avif";
import nouraWebp from "@/assets/proof/example-noura.webp";
import atlasAvif from "@/assets/proof/example-atlas.avif";
import atlasWebp from "@/assets/proof/example-atlas.webp";
import frameAvif from "@/assets/proof/example-frame24.avif";
import frameWebp from "@/assets/proof/example-frame24.webp";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Land-IA | Landing Pages com IA — Zero Programação" },
      {
        name: "description",
        content:
          "Crie uma landing profissional com ChatGPT + Lovable, publique no seu próprio domínio e deixe tudo pronto para vender — sem precisar saber programar.",
      },
      { name: "theme-color", content: "#0B0D10" },
      { property: "og:title", content: "Land-IA | Landing Pages com IA" },
      {
        property: "og:description",
        content:
          "Da estratégia ao seu próprio domínio: estruture a página no ChatGPT, construa com Lovable e publique sem precisar saber programar.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.metamove.online/" },
      { property: "og:site_name", content: "Land-IA" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: "https://www.metamove.online/og-landia.webp" },
      { property: "og:image:secure_url", content: "https://www.metamove.online/og-landia.webp" },
      { property: "og:image:type", content: "image/webp" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Land-IA — Landing Pages com IA" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Land-IA | Landing Pages com IA" },
      {
        name: "twitter:description",
        content:
          "Da estratégia ao seu próprio domínio: estruture a página no ChatGPT, construa com Lovable e publique sem precisar saber programar.",
      },
      { name: "twitter:image", content: "https://www.metamove.online/og-landia.webp" },
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
  variant?: "orange" | "lime" | "ink";
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
        <div className="forge-offer-brand">
          <span className="forge-brand-mark">L//</span>
          <strong>LAND-IA</strong>
          <span>LANDING PAGES COM IA</span>
        </div>
        <div className="forge-offer-price">
          <span>PAGAMENTO ÚNICO</span>
          <strong>R$ 47</strong>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   01 — HERO / BUILD STAGE
   ================================================================ */
const BUILD_STEPS = [
  ["01", "DECIDIR", "Oferta + persona + promessa"],
  ["02", "INSTRUIR", "Prompt Mestre"],
  ["03", "EXECUTAR", "ChatGPT + Lovable"],
  ["04", "PUBLICAR", "GitHub + Vercel + domínio"],
];

function HeroBuildVisual() {
  return (
    <div className="forge-build-visual" aria-hidden="true">
      <div className="forge-build-caption">
        <span>BUILD SEQUENCE</span>
        <b>04 / 04</b>
      </div>

      <div className="forge-build-rail">
        <div className="forge-build-beam" />
        {BUILD_STEPS.map(([n, title, text], i) => (
          <div key={title} className="forge-build-step" data-enter="" style={stepDelay(i + 1)}>
            <span className="forge-build-number">{n}</span>
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="forge-page-slab forge-page-slab-back" />
      <div className="forge-page-slab forge-page-slab-main">
        <div className="forge-slab-browser">
          <span />
          <span />
          <span />
          <b>seudominio.com.br</b>
        </div>
        <div className="forge-slab-content">
          <small>ARQUITETURA DE CONVERSÃO</small>
          <h3>UMA PÁGINA<br />COM FUNÇÃO.</h3>
          <div className="forge-slab-line forge-slab-line-a" />
          <div className="forge-slab-line forge-slab-line-b" />
          <div className="forge-slab-button">CTA</div>
        </div>
      </div>
      <div className="forge-prompt-chip">
        <span>PROMPT MESTRE</span>
        <strong>01 arquivo</strong>
      </div>
      <div className="forge-publish-chip">
        <span>STATUS</span>
        <strong>PUBLICADA ✓</strong>
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
            <span /> LAND-IA / BUILD SYSTEM 01
          </div>

          <h1>
            <span>UMA LANDING</span>
            <span className="forge-outline-word">QUE PARECE CARA.</span>
            <span className="forge-lime-line">SEM ESCREVER</span>
            <span className="forge-lime-line">UMA LINHA DE CÓDIGO.</span>
          </h1>

          <p className="forge-hero-lead">
            Transforme sua oferta em uma landing profissional com <strong>ChatGPT + Lovable</strong> e publique no seu próprio domínio — usando um processo que começa <strong>antes</strong> da IA.
          </p>

          <div className="forge-hero-actions">
            <CTAButton href="#vsl" variant="lime">VER O PROCESSO FUNCIONANDO</CTAButton>
            <div className="forge-hero-note">
              <span>SEM PROGRAMAÇÃO</span>
              <span>SEM TEMPLATE ENGESSADO</span>
              <span>SEM DEPENDER DE AGÊNCIA</span>
            </div>
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
            <p>Vou te mostrar a lógica, a execução e o que acontece quando a IA recebe direção.</p>
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
const REALITY_ROWS = [
  ["PROMPT GENÉRICO", "A IA precisa inventar estratégia, copy e design ao mesmo tempo."],
  ["AJUSTE EM CIMA DE AJUSTE", "Cada correção resolve uma coisa e quebra outra. Os créditos evaporam."],
  ["PÁGINA BONITA, SEM DIREÇÃO", "Visual existe. Jornada de decisão, não."],
];

function Reality() {
  return (
    <section className="forge-reality">
      <div className="forge-shell">
        <Reveal className="forge-reality-head">
          <SectionTag index="03" light>O PROBLEMA REAL</SectionTag>
          <h2>
            A IA NÃO É O PROBLEMA.
            <span>O PROBLEMA É PEDIR PARA ELA DECIDIR POR VOCÊ.</span>
          </h2>
          <p>
            Quando a construção começa antes das decisões, o que deveria acelerar vira retrabalho. O Land-IA inverte essa ordem.
          </p>
        </Reveal>

        <RevealGroup className="forge-reality-board">
          <div className="forge-reality-column forge-reality-column-wrong">
            <div className="forge-reality-label"><span>SEM ARQUITETURA</span><b>RETRABALHO</b></div>
            {REALITY_ROWS.map(([title, text], i) => (
              <div data-reveal="" style={stepDelay(i)} className="forge-reality-row" key={title}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
                <X aria-hidden="true" />
              </div>
            ))}
          </div>

          <div className="forge-reality-turn" aria-hidden="true">
            <span>INVERTER</span><ArrowRight />
          </div>

          <div className="forge-reality-column forge-reality-column-right">
            <div className="forge-reality-label"><span>COM LAND-IA</span><b>DIREÇÃO</b></div>
            {[
              ["DECISÕES PRIMEIRO", "Oferta, persona, promessa, mecanismo e objeções saem do improviso."],
              ["UM PROMPT MESTRE", "A IA recebe contexto suficiente para construir com intenção."],
              ["AJUSTES CIRÚRGICOS", "Você corrige só o necessário e preserva o que já funciona."],
            ].map(([title, text], i) => (
              <div data-reveal="" style={stepDelay(i + 1)} className="forge-reality-row" key={title}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
                <Check aria-hidden="true" />
              </div>
            ))}
          </div>
        </RevealGroup>

        <Reveal className="forge-reality-mantra">
          <span>O objetivo não é ter mais créditos.</span>
          <strong>É precisar de menos.</strong>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   04 — EVIDÊNCIA / PROCESSO REAL
   ================================================================ */
function Proofs() {
  return (
    <section className="forge-proofs landia-cv-proofs">
      <div className="forge-shell">
        <Reveal className="forge-proofs-head">
          <SectionTag index="04">VEJA O PROCESSO ACONTECER</SectionTag>
          <h2>DO RACIOCÍNIO À PÁGINA NO AR.</h2>
          <p>
            Sem depoimento inventado. Sem print de faturamento emprestado. Aqui a evidência é o próprio processo produzindo uma landing real.
          </p>
        </Reveal>

        <div className="forge-proof-stage forge-proof-stage-strategy">
          <Reveal className="forge-proof-copy">
            <span className="forge-proof-index">01</span>
            <h3>DA ESTRATÉGIA AO PROMPT MESTRE</h3>
            <p>
              Primeiro vêm as decisões: oferta, persona, problema, promessa, mecanismo, estrutura e direção visual. Depois tudo é condensado em uma instrução única.
            </p>
          </Reveal>
          <RevealGroup className="forge-proof-twin">
            <figure data-reveal="" className="forge-shot forge-shot-paper">
              <Picture avif={briefingAvif} webp={briefingWebp} alt="Briefing estratégico usado antes da construção da landing" width={700} height={771} />
              <figcaption><b>BRIEFING ESTRATÉGICO</b><span>As decisões que vêm antes da tela.</span></figcaption>
            </figure>
            <figure data-reveal="" style={stepDelay(1)} className="forge-shot forge-shot-paper forge-shot-offset">
              <Picture avif={promptAvif} webp={promptWebp} alt="Prompt Mestre criado a partir do briefing estratégico" width={700} height={781} />
              <figcaption><b>PROMPT MESTRE</b><span>Contexto suficiente para a IA executar.</span></figcaption>
            </figure>
          </RevealGroup>
        </div>

        <div className="forge-proof-stage forge-proof-stage-build">
          <Reveal className="forge-proof-copy forge-proof-copy-light">
            <span className="forge-proof-index">02</span>
            <h3>DO PROMPT À CONSTRUÇÃO</h3>
            <p>
              O Lovable deixa de receber um pedido vago e passa a receber uma arquitetura. A geração inicial começa muito mais perto do resultado desejado.
            </p>
          </Reveal>
          <RevealGroup className="forge-build-collage">
            <figure data-reveal="" className="forge-shot forge-shot-dark forge-build-shot-a">
              <Picture avif={lovablePromptAvif} webp={lovablePromptWebp} alt="Prompt Mestre inserido no Lovable" width={760} height={544} />
              <figcaption><b>01 / INSTRUÇÃO</b><span>O Prompt Mestre entra inteiro.</span></figcaption>
            </figure>
            <figure data-reveal="" style={stepDelay(1)} className="forge-shot forge-shot-dark forge-build-shot-b">
              <Picture avif={lovableBuildAvif} webp={lovableBuildWebp} alt="Lovable construindo a landing após receber o Prompt Mestre" width={691} height={563} />
              <figcaption><b>02 / EXECUÇÃO</b><span>A IA constrói a partir das decisões.</span></figcaption>
            </figure>
          </RevealGroup>
        </div>

        <div className="forge-proof-stage forge-proof-stage-result">
          <Reveal className="forge-proof-copy">
            <span className="forge-proof-index">03</span>
            <h3>DA CONSTRUÇÃO À LANDING</h3>
            <p>
              Uma direção visual forte não precisa nascer de dezenas de tentativas. Desktop, mobile e narrativa continuam falando a mesma língua.
            </p>
          </Reveal>

          <Reveal className="forge-result-canvas">
            <div className="forge-result-browser">
              <div className="forge-result-browser-top"><i/><i/><i/><span>social-os.example</span></div>
              <Picture avif={heroDesktopAvif} webp={heroDesktopWebp} alt="Hero de uma landing exemplo criada com o processo Land-IA" width={1280} height={610} />
            </div>
            <div className="forge-result-phone">
              <Picture avif={heroMobileAvif} webp={heroMobileWebp} alt="Versão mobile da landing exemplo" width={480} height={903} />
            </div>
            <div className="forge-result-stamp"><span>DESKTOP + MOBILE</span><strong>MESMA DIREÇÃO</strong></div>
          </Reveal>

          <RevealGroup className="forge-result-strip">
            <figure data-reveal="" className="forge-mini-shot">
              <Picture avif={sectionTwoAvif} webp={sectionTwoWebp} alt="Segunda seção da landing exemplo" width={1280} height={610} />
              <figcaption>DIAGNÓSTICO</figcaption>
            </figure>
            <figure data-reveal="" style={stepDelay(1)} className="forge-mini-shot">
              <Picture avif={sectionThreeAvif} webp={sectionThreeWebp} alt="Terceira seção da landing exemplo" width={1280} height={610} />
              <figcaption>MECANISMO</figcaption>
            </figure>
          </RevealGroup>
        </div>

        <div className="forge-proof-stage forge-proof-stage-world">
          <Reveal className="forge-proof-copy forge-proof-copy-light">
            <span className="forge-proof-index">04</span>
            <h3>DA LANDING AO MUNDO REAL</h3>
            <p>
              O processo não termina no construtor. A página vai para o domínio, precisa funcionar no celular e precisa continuar rápida.
            </p>
          </Reveal>

          <div className="forge-world-grid">
            <Reveal className="forge-speed-card">
              <div className="forge-speed-copy">
                <span>PERFORMANCE MOBILE</span>
                <strong>100</strong>
                <p>Uma das páginas demonstrativas, medida após publicação.</p>
              </div>
              <Picture avif={pageSpeedAvif} webp={pageSpeedWebp} alt="Teste PageSpeed da landing exemplo com desempenho 100" width={900} height={698} />
            </Reveal>

            <RevealGroup className="forge-repertoire">
              {[
                [nouraAvif, nouraWebp, "NOURA", "Lifestyle / nutrição"],
                [atlasAvif, atlasWebp, "ATLAS", "Finanças / sistema"],
                [frameAvif, frameWebp, "FRAME 24", "Filmmaking / criativo"],
              ].map(([avif, webp, title, label], i) => (
                <figure data-reveal="" style={stepDelay(i)} className="forge-repertoire-item" key={String(title)}>
                  <Picture avif={String(avif)} webp={String(webp)} alt={`Landing exemplo ${title}`} width={1280} height={612} />
                  <figcaption><strong>{title}</strong><span>{label}</span></figcaption>
                </figure>
              ))}
            </RevealGroup>
          </div>

          <Reveal className="forge-proof-close">
            <span>Não é um template.</span>
            <strong>É um processo capaz de receber direções diferentes.</strong>
          </Reveal>
        </div>
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
            Em vez de abrir a IA e perguntar “o que eu coloco na página?”, você começa pela última decisão do visitante e trabalha de trás para frente.
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
          <strong>Você decide. A IA executa.</strong>
        </Reveal>
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
            <h2>LAND-IA NÃO É UMA AULA SOBRE IA.</h2>
            <p>É uma implementação guiada: abra, assista, execute e avance até a página publicada.</p>
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
          <h2>UM PROCESSO INTEIRO.<br /><span>POR MENOS QUE UM TEMPLATE.</span></h2>
          <p>
            Você leva a implementação guiada + os dois bônus para estruturar, construir, publicar e manter sua landing funcionando.
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
          <div className="forge-price-top"><Sparkles aria-hidden="true" /><span>ACESSO IMEDIATO</span></div>
          <div className="forge-price-reference"><span>VALOR DE REFERÊNCIA</span><s>R$ 341</s></div>
          <div className="forge-price-main"><span>HOJE</span><strong><small>R$</small>47</strong></div>
          <p>Pagamento único.</p>
          <CTAButton className="w-full" variant="orange">COMEÇAR AGORA</CTAButton>
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
  ["01", "DESCOBRIR SOZINHO", "Pesquisar → testar → errar → refazer", "TEMPO ALTO"],
  ["02", "TERCEIRIZAR TUDO", "Designer → copywriter → dev → manutenção", "CUSTO + DEPENDÊNCIA"],
  ["03", "APRENDER O PROCESSO", "Estratégia → IA → domínio próprio", "AUTONOMIA", "active"],
];

function Comparison() {
  return (
    <section className="forge-comparison landia-cv-comparison">
      <div className="forge-shell">
        <Reveal className="forge-comparison-head">
          <SectionTag index="08" light>TRÊS CAMINHOS</SectionTag>
          <h2>A LANDING VAI EXISTIR DE UM JEITO OU DE OUTRO.<br /><span>A QUESTÃO É COMO VOCÊ CHEGA ATÉ ELA.</span></h2>
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
          <h2>VOCÊ PODE CONTINUAR PEDINDO PARA A IA “FAZER UMA LANDING”.</h2>
        </Reveal>
        <Reveal delay={0.08} className="forge-decision-answer">
          <span>OU</span>
          <h3>PODE COMEÇAR A ENTREGAR PARA ELA DECISÕES QUE JÁ FORAM TOMADAS.</h3>
          <p>
            Essa é a diferença entre usar IA como roleta e usar IA como executora.
          </p>
          <CTAButton href="#oferta" variant="ink">QUERO APRENDER O PROCESSO</CTAButton>
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
          <h2>DECIDA A PÁGINA.<br /><span>DEIXE A IA CONSTRUIR.</span></h2>
          <p>Da estratégia ao seu próprio domínio. Sem programação.</p>
          <CTAButton variant="orange">COMEÇAR COM O LAND-IA — R$ 47</CTAButton>
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
