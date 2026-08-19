import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
   TRACKING — mantido no mesmo fluxo da versão otimizada
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
      headers: { "Content-Type": "application/json" },
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
  kind = "primary",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  kind?: "primary" | "ghost";
  className?: string;
}) {
  const isExternal = href.startsWith("http");
  const isCheckout = href.includes("hotmart.com");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={(event) => {
        if (isCheckout) {
          void sendFacebookEvent("InitiateCheckout");
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
      className={`lv2-btn ${kind === "ghost" ? "lv2-btn-ghost" : "lv2-btn-primary"} ${className}`}
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" />
    </a>
  );
}

function Kicker({ number, children, light = false }: { number: string; children: ReactNode; light?: boolean }) {
  return (
    <div className={`lv2-kicker ${light ? "lv2-kicker-light" : ""}`}>
      <span>{number}</span>
      <i />
      <strong>{children}</strong>
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
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
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
      void sendFacebookEvent("PageView");
    }

    const timer = window.setTimeout(() => {
      if (timeOnPageSent) return;
      timeOnPageSent = true;
      void sendFacebookEvent("TimeOnPage");
    }, 30000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="landia-v2">
      <Hero />
      <VslIntro />
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
   01 — HERO / PROMESSA
   ================================================================ */
function Hero() {
  return (
    <section className="lv2-hero" id="inicio">
      <div className="lv2-grid" aria-hidden="true" />
      <div className="lv2-orb lv2-orb-a" aria-hidden="true" />
      <div className="lv2-orb lv2-orb-b" aria-hidden="true" />

      <header className="lv2-topbar" data-enter="">
        <a className="lv2-brand" href="#inicio" aria-label="Land-IA">
          <span className="lv2-brand-mark">L//</span>
          <span>LAND-IA</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#provas">Provas</a>
          <a href="#metodo">Método</a>
          <CTAButton href="#oferta" kind="ghost">Ver oferta</CTAButton>
        </nav>
      </header>

      <div className="lv2-hero-layout">
        <div className="lv2-hero-copy">
          <div className="lv2-eyebrow" data-enter="">
            <span className="lv2-live-dot" />
            LAND-IA™ / LANDING PAGES COM IA
          </div>

          <h1>
            PARE DE <span className="lv2-strike">PEDIR</span> PÁGINAS PARA A IA.
            <span>COMECE A PROJETAR <em>DECISÕES.</em></span>
          </h1>

          <p className="lv2-hero-lead" data-enter="" style={{ "--reveal-delay": "0.08s" } as CSSProperties}>
            Transforme sua oferta em uma landing profissional usando <strong>ChatGPT + Lovable</strong>,
            publique no seu próprio domínio e deixe tudo pronto para vender — <strong>sem precisar saber programar.</strong>
          </p>

          <div className="lv2-hero-actions" data-enter="" style={{ "--reveal-delay": "0.14s" } as CSSProperties}>
            <CTAButton href="#vsl">Ver o processo em ação</CTAButton>
            <div className="lv2-hero-price">
              <strong>R$ 47</strong>
              <span>pagamento único</span>
            </div>
          </div>

          <div className="lv2-flowline" data-enter="" style={{ "--reveal-delay": "0.18s" } as CSSProperties}>
            <span>ESTRATÉGIA</span><i />
            <span>PROMPT MESTRE</span><i />
            <span>LOVABLE</span><i />
            <span>DOMÍNIO</span>
          </div>

          <div className="lv2-hero-note" data-enter="" style={{ "--reveal-delay": "0.22s" } as CSSProperties}>
            <span>01</span>
            <p>Arquitetura antes da IA. Direção antes da execução.</p>
          </div>
        </div>

        <div className="lv2-engine" data-enter="" style={{ "--reveal-delay": "0.08s" } as CSSProperties}>
          <div className="lv2-engine-shell">
            <div className="lv2-engine-top">
              <div className="lv2-window-dots"><span /><span /><span /></div>
              <span>DECISION ENGINE / LIVE</span>
              <strong>READY</strong>
            </div>

            <div className="lv2-engine-body">
              <aside>
                <div className="lv2-engine-logo">L//</div>
                <span className="active">01</span>
                <span>02</span>
                <span>03</span>
                <span>04</span>
              </aside>

              <div className="lv2-engine-main">
                <div className="lv2-engine-heading">
                  <div>
                    <small>MASTER PROMPT / ARCHITECTURE</small>
                    <h3>A IA executa.<br />Você dirige.</h3>
                  </div>
                  <div className="lv2-engine-score">
                    <small>DECISÕES</small>
                    <strong>6/6</strong>
                    <span>mapeadas</span>
                  </div>
                </div>

                <div className="lv2-engine-rows">
                  {["Oferta", "Persona", "Promessa", "Mecanismo", "Prova", "Decisão"].map((item, index) => (
                    <div key={item}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{item}</strong>
                      <em>{index < 5 ? "DEFINED" : "READY"}</em>
                      <i style={{ "--fill": `${72 + index * 4}%` } as CSSProperties}><b /></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lv2-float-card lv2-float-prompt">
            <small>PROMPT MESTRE</small>
            <strong>Estratégia concentrada.</strong>
            <span>menos tentativa → mais direção</span>
          </div>
          <div className="lv2-float-card lv2-float-domain">
            <span className="lv2-live-dot" />
            <strong>seudominio.com.br</strong>
            <small>PUBLICADO</small>
          </div>
        </div>
      </div>

      <div className="lv2-scroll-cue" aria-hidden="true"><span>SCROLL / ASSISTA</span><i /></div>
    </section>
  );
}

/* ================================================================
   02 — VSL
   ================================================================ */
function VslIntro() {
  return (
    <section className="lv2-vsl-intro" id="vsl">
      <div className="lv2-container">
        <Kicker number="02">VEJA ANTES DE ACREDITAR</Kicker>
        <Reveal className="lv2-vsl-head">
          <h2>5 minutos para ver o processo inteiro <span>saindo da ideia e chegando na tela.</span></h2>
          <p>Sem promessa abstrata. Assista como estratégia, Prompt Mestre, Lovable e publicação se conectam.</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   03 — REALIDADE DA PERSONA
   ================================================================ */
function Reality() {
  return (
    <section className="lv2-reality">
      <div className="lv2-container">
        <Kicker number="03" light>O PROBLEMA NÃO É A FERRAMENTA</Kicker>

        <Reveal className="lv2-reality-head">
          <p className="lv2-pretitle">SE VOCÊ COMEÇA PELO LOVABLE,</p>
          <h2>VOCÊ COMEÇA <strong>TARDE DEMAIS.</strong></h2>
          <p>
            A página não deveria nascer quando a IA recebe um pedido. Ela deveria nascer quando você define
            <b> o que o visitante precisa entender, acreditar e decidir.</b>
          </p>
        </Reveal>

        <RevealGroup className="lv2-reality-grid">
          <article data-reveal="" className="lv2-chaos-card">
            <div className="lv2-card-label"><span>MODE / REACTIVE</span><i /></div>
            <h3>PROMPT<br />SOLTO.</h3>
            <div className="lv2-chaos-cloud" aria-hidden="true">
              <span style={{ "--x": "6%", "--y": "10%", "--r": "-5deg" } as CSSProperties}>“deixa mais premium”</span>
              <span style={{ "--x": "53%", "--y": "5%", "--r": "7deg" } as CSSProperties}>troca a headline</span>
              <span style={{ "--x": "15%", "--y": "48%", "--r": "4deg" } as CSSProperties}>arruma mobile</span>
              <span style={{ "--x": "60%", "--y": "44%", "--r": "-6deg" } as CSSProperties}>mais um crédito</span>
              <span style={{ "--x": "32%", "--y": "73%", "--r": "8deg" } as CSSProperties}>tenta de novo</span>
            </div>
            <footer><span>resultado</span><strong>RETRABALHO</strong></footer>
          </article>

          <div className="lv2-logic-shift" aria-hidden="true">
            <span>→</span><small>MUDANÇA<br />DE LÓGICA</small>
          </div>

          <article data-reveal="" style={stepDelay(1)} className="lv2-system-card">
            <div className="lv2-card-label"><span>MODE / SYSTEM</span><i /></div>
            <h3>PROMPT<br />MESTRE.</h3>
            <div className="lv2-decision-stack">
              {["Oferta", "Persona", "Promessa", "Mecanismo", "Objeções", "Prova"].map((item, index) => (
                <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><small>definido</small></div>
              ))}
            </div>
            <footer><span>resultado</span><strong>DIREÇÃO</strong></footer>
          </article>
        </RevealGroup>

        <Reveal className="lv2-reality-quote">
          <span>“</span>
          <p>O objetivo não é ter mais créditos.<br /><strong>É precisar de menos.</strong></p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   04 — PROVAS
   ================================================================ */
function Proofs() {
  return (
    <section className="lv2-proofs landia-cv-proof" id="provas">
      <div className="lv2-proof-bg" aria-hidden="true">EXECUTE</div>
      <div className="lv2-container">
        <Kicker number="04">VEJA O PROCESSO ACONTECER</Kicker>
        <Reveal className="lv2-proof-head">
          <div>
            <p className="lv2-pretitle">VOCÊ JÁ ENTENDEU A LÓGICA.</p>
            <h2>AGORA VEJA ELA <strong>FUNCIONANDO.</strong></h2>
          </div>
          <p>Sem depoimento inventado e sem resultado emprestado. A prova aqui é o próprio processo saindo de decisões e virando páginas reais.</p>
        </Reveal>

        <div className="lv2-proof-track">
          <Reveal className="lv2-proof-stage lv2-proof-stage-strategy">
            <div className="lv2-proof-copy">
              <span>01 / INPUT</span>
              <h3>DA ESTRATÉGIA AO PROMPT MESTRE</h3>
              <p>Oferta, persona, promessa, mecanismo, copy e direção visual são definidos antes da construção.</p>
            </div>
            <div className="lv2-shot-pair">
              <figure>
                <Picture avif={briefingAvif} webp={briefingWebp} alt="Briefing estratégico usado antes da construção da landing" width={700} height={771} />
                <figcaption><b>BRIEFING ESTRATÉGICO</b><span>Decisões antes do layout.</span></figcaption>
              </figure>
              <figure>
                <Picture avif={promptAvif} webp={promptWebp} alt="Prompt Mestre estruturado para a criação da landing" width={700} height={781} />
                <figcaption><b>PROMPT MESTRE</b><span>Estratégia concentrada em instrução.</span></figcaption>
              </figure>
            </div>
          </Reveal>

          <Reveal className="lv2-proof-stage lv2-proof-stage-build">
            <div className="lv2-proof-copy">
              <span>02 / EXECUTION</span>
              <h3>DO PROMPT À CONSTRUÇÃO</h3>
              <p>O Lovable não recebe “faça uma landing bonita”. Recebe direção suficiente para começar muito mais perto do resultado final.</p>
            </div>
            <div className="lv2-build-shots">
              <figure>
                <Picture avif={lovablePromptAvif} webp={lovablePromptWebp} alt="Prompt Mestre inserido no Lovable" width={760} height={544} />
                <figcaption><b>INSTRUÇÃO</b><span>Prompt Mestre entrando no construtor.</span></figcaption>
              </figure>
              <div className="lv2-build-arrow" aria-hidden="true">→</div>
              <figure>
                <Picture avif={lovableBuildAvif} webp={lovableBuildWebp} alt="Lovable construindo a página a partir do Prompt Mestre" width={691} height={563} />
                <figcaption><b>EXECUÇÃO</b><span>A página nascendo a partir das decisões.</span></figcaption>
              </figure>
            </div>
          </Reveal>

          <Reveal className="lv2-proof-stage lv2-proof-stage-result">
            <div className="lv2-proof-copy">
              <span>03 / OUTPUT</span>
              <h3>DA CONSTRUÇÃO À LANDING</h3>
              <p>Desktop, mobile e seções internas respondem à mesma arquitetura — sem parecer um template repetido.</p>
            </div>
            <div className="lv2-result-wall">
              <figure className="lv2-result-main">
                <Picture avif={heroDesktopAvif} webp={heroDesktopWebp} alt="Hero desktop da landing SOCIAL OS criada pelo processo" width={1280} height={610} />
              </figure>
              <figure className="lv2-result-mobile">
                <Picture avif={heroMobileAvif} webp={heroMobileWebp} alt="Hero mobile da landing SOCIAL OS criada pelo processo" width={480} height={903} />
              </figure>
              <figure className="lv2-result-sub lv2-result-sub-a">
                <Picture avif={sectionTwoAvif} webp={sectionTwoWebp} alt="Segunda seção da landing exemplo" width={1280} height={610} />
              </figure>
              <figure className="lv2-result-sub lv2-result-sub-b">
                <Picture avif={sectionThreeAvif} webp={sectionThreeWebp} alt="Terceira seção da landing exemplo" width={1280} height={610} />
              </figure>
            </div>
          </Reveal>

          <Reveal className="lv2-proof-stage lv2-proof-stage-range">
            <div className="lv2-proof-copy">
              <span>04 / REPEATABILITY</span>
              <h3>UM PROCESSO. VÁRIAS DIREÇÕES.</h3>
              <p>O método não existe para reproduzir um estilo. Ele existe para transformar decisões diferentes em páginas diferentes.</p>
            </div>
            <div className="lv2-example-strip">
              <figure><Picture avif={nouraAvif} webp={nouraWebp} alt="Landing exemplo NOURA em paleta vinho" width={1280} height={612} /><figcaption>NOURA / LIFESTYLE</figcaption></figure>
              <figure><Picture avif={atlasAvif} webp={atlasWebp} alt="Landing exemplo ATLAS em paleta azul" width={1280} height={612} /><figcaption>ATLAS / FINANÇAS</figcaption></figure>
              <figure><Picture avif={frameAvif} webp={frameWebp} alt="Landing exemplo FRAME24 em paleta escura" width={1280} height={611} /><figcaption>FRAME24 / CRIATIVO</figcaption></figure>
            </div>

            <div className="lv2-speed-proof">
              <div>
                <span>PUBLICADA. RESPONSIVA. OTIMIZADA.</span>
                <strong>100</strong>
                <p>Desempenho mobile registrado no PageSpeed em uma das páginas do processo.</p>
              </div>
              <Picture avif={pageSpeedAvif} webp={pageSpeedWebp} alt="Teste PageSpeed com desempenho 100 no mobile" width={900} height={698} />
            </div>
          </Reveal>
        </div>

        <Reveal className="lv2-proof-bridge">
          <span>L// PRINCÍPIO</span>
          <p>Não foi a IA que decidiu o que essas páginas deveriam ser. <strong>Ela recebeu decisões suficientes para construir.</strong></p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   05 — MECANISMO
   ================================================================ */
const REVERSE_STEPS = [
  ["06", "DECISÃO", "Qual ação precisa acontecer no fim?"],
  ["05", "SEGURANÇA", "O que precisa reduzir o risco de agir?"],
  ["04", "OFERTA", "O que torna o próximo passo claro?"],
  ["03", "PROVA", "O que precisa ser visto para gerar crença?"],
  ["02", "MECANISMO", "Por que esta solução faz sentido?"],
  ["01", "PROMESSA", "O que precisa ser entendido primeiro?"],
] as const;

function Mechanism() {
  return (
    <section className="lv2-mechanism" id="metodo">
      <div className="lv2-mechanism-word" aria-hidden="true">DECISÃO</div>
      <div className="lv2-container">
        <Kicker number="05">O MECANISMO</Kicker>
        <Reveal className="lv2-mechanism-head">
          <div>
            <p className="lv2-pretitle">ENGENHARIA REVERSA DA CONVERSÃO™</p>
            <h2>CONSTRUA A DECISÃO.<br /><span>DEPOIS CONSTRUA A PÁGINA.</span></h2>
          </div>
          <p>Em vez de começar pela primeira dobra, você começa pela última decisão do visitante e constrói o caminho de volta.</p>
        </Reveal>

        <RevealGroup className="lv2-reverse-track">
          <div className="lv2-reverse-line" aria-hidden="true"><span /></div>
          {REVERSE_STEPS.map(([number, title, text], index) => (
            <div className="lv2-reverse-step" data-reveal="" style={stepDelay(index)} key={title}>
              <div className="lv2-orbit"><span>{number}</span></div>
              <div className="lv2-reverse-copy">
                <small>REVERSE / {title}</small>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <div className="lv2-reverse-code">{index === 0 ? "ACTION" : `${REVERSE_STEPS[index - 1]?.[1] ?? ""} ← ${title}`}</div>
            </div>
          ))}
        </RevealGroup>

        <Reveal className="lv2-mechanism-footer">
          <div className="lv2-method-seal"><span>L//</span><small>ARCHITECTURE FIRST</small></div>
          <p><strong>Comece pela decisão.</strong> Construa o caminho de volta. Deixe a IA executar.</p>
          <CTAButton href="#produto" kind="ghost">Ver o que você aprende</CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   06 — PRODUTO
   ================================================================ */
const LESSONS = [
  ["01", "Antes de abrir a IA", "Entenda por que página bonita e página estratégica não são a mesma coisa."],
  ["02", "Engenharia Reversa", "Construa a jornada começando pela decisão final."],
  ["03", "O Prompt Mestre", "Concentre estratégia, copy, estrutura e direção visual em uma única instrução."],
  ["04", "Construindo com IA", "Execute no Lovable e ajuste pontos específicos sem reconstruir tudo."],
  ["05", "De bonita para pronta", "Audite hierarquia, mobile, clareza, performance e coerência."],
  ["06", "Checkout e ajustes", "Conecte CTA, revise a experiência e deixe a página pronta para vender."],
  ["07", "Seu próprio domínio", "Lovable → GitHub → Vercel → DNS → domínio próprio."],
] as const;

function Product() {
  return (
    <section className="lv2-product landia-cv-product" id="produto">
      <div className="lv2-container">
        <Kicker number="06" light>O PRODUTO</Kicker>
        <Reveal className="lv2-product-head">
          <div>
            <p className="lv2-pretitle">LAND-IA / IMPLEMENTAÇÃO GUIADA</p>
            <h2>VOCÊ NÃO COMPRA UM PROMPT.<br /><span>APRENDE A REPETIR O PROCESSO.</span></h2>
          </div>
          <p>Vídeo-aulas práticas, gravação de tela e execução real. Da oferta até uma landing publicada no seu próprio domínio.</p>
        </Reveal>

        <RevealGroup className="lv2-lessons">
          {LESSONS.map(([number, title, text], index) => (
            <article data-reveal="" style={stepDelay(index)} key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
              <i aria-hidden="true">↗</i>
            </article>
          ))}
        </RevealGroup>

        <RevealGroup className="lv2-bonus-grid">
          <article data-reveal="" className="lv2-bonus-card">
            <span>BÔNUS 01</span>
            <h3>BIBLIOTECA LAND-IA</h3>
            <p>Prompts, estruturas e referências para acelerar decisões que você vai reutilizar em novos projetos.</p>
            <footer>REUTILIZE / ADAPTE / EXECUTE</footer>
          </article>
          <article data-reveal="" style={stepDelay(1)} className="lv2-bonus-card lv2-bonus-card-dark">
            <span>BÔNUS 02</span>
            <h3>LANDING INVISÍVEL</h3>
            <p>Performance, tracking e infraestrutura: a camada que o visitante não vê, mas que separa uma página bonita de uma operação pronta.</p>
            <footer>PERFORMANCE / TRACKING / INFRA</footer>
          </article>
        </RevealGroup>
      </div>
    </section>
  );
}

/* ================================================================
   07 — OFERTA
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
          void sendFacebookEvent("ViewContent");
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const includes = [
    "Treinamento completo — estratégia à publicação",
    "Engenharia Reversa da Conversão™",
    "Prompt Mestre e implementação no Lovable",
    "GitHub → Vercel → DNS → domínio próprio",
    "Bônus: Biblioteca Land-IA",
    "Bônus: Landing Invisível",
  ];

  return (
    <section ref={offerRef} id="oferta" className="lv2-offer landia-cv-offer">
      <div className="lv2-offer-grid" aria-hidden="true" />
      <div className="lv2-container">
        <Kicker number="07">A OFERTA</Kicker>
        <Reveal className="lv2-offer-head">
          <h2>DA IDEIA AO DOMÍNIO.<br /><span>SEM DEPENDER DE PROGRAMAÇÃO.</span></h2>
          <p>Você entra com uma oferta. Sai entendendo como estruturar, instruir, construir, revisar e publicar.</p>
        </Reveal>

        <Reveal className="lv2-offer-card">
          <div className="lv2-offer-price">
            <div className="lv2-offer-status"><Sparkles /> LAND-IA + 2 BÔNUS</div>
            <small>ACESSO IMEDIATO / PAGAMENTO ÚNICO</small>
            <div className="lv2-price-row"><span>R$</span><strong>47</strong></div>
            <p>Uma única compra. O processo inteiro.</p>
            <CTAButton>Começar agora por R$ 47</CTAButton>
            <div className="lv2-secure"><Lock /> Pagamento seguro processado pela Hotmart</div>
          </div>

          <div className="lv2-offer-includes">
            <span>VOCÊ RECEBE</span>
            <ul>
              {includes.map((item) => (
                <li key={item}><i><Check /></i><span>{item}</span></li>
              ))}
            </ul>
            <div className="lv2-offer-ref">
              <span>Composição de referência</span>
              <b>R$ 341</b>
              <strong>HOJE / R$ 47</strong>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   08 — COMPARAÇÃO
   ================================================================ */
const WAYS = [
  ["01", "FAZER TUDO SOZINHO", ["Pesquisar", "Testar", "Errar", "Refazer", "Descobrir infraestrutura"], "TEMPO ALTO"],
  ["02", "CONTRATAR", ["Designer", "Copywriter", "Desenvolvedor", "Manutenção"], "DEPENDÊNCIA"],
  ["03", "LAND-IA", ["Processo repetível", "IA como executora", "Publicação no seu domínio"], "AUTONOMIA"],
] as const;

function Comparison() {
  return (
    <section className="lv2-comparison landia-cv-comparison">
      <div className="lv2-container">
        <Kicker number="08" light>COMPARAÇÃO LÓGICA</Kicker>
        <Reveal className="lv2-comparison-head">
          <h2>EXISTEM TRÊS FORMAS DE TER UMA LANDING.<br /><span>SÓ UMA DELAS TE ENSINA A REPETIR.</span></h2>
        </Reveal>

        <RevealGroup className="lv2-way-grid">
          {WAYS.map(([number, title, items, result], index) => (
            <article key={title} data-reveal="" style={stepDelay(index)} className={index === 2 ? "featured" : ""}>
              <span>{number}</span>
              <h3>{title}</h3>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              <footer>{result}</footer>
            </article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ================================================================
   09 — QUEBRA DE OBJEÇÕES
   ================================================================ */
const OBJECTIONS = [
  ["EU NÃO SEI PROGRAMAR.", "Ótimo. O processo foi desenhado justamente para quem quer transformar instrução em execução sem escrever código."],
  ["EU NUNCA USEI LOVABLE.", "A implementação é mostrada do zero, com foco no que realmente importa para transformar o Prompt Mestre em uma landing."],
  ["E OS CRÉDITOS GRATUITOS?", "Você estrutura a maior parte das decisões antes de abrir o Lovable. A meta é reduzir retrabalho e reservar créditos para ajustes que realmente importam."],
  ["EU NÃO SOU DESIGNER.", "Você aprende hierarquia, estrutura e direção visual suficientes para orientar a IA — sem precisar virar designer."],
  ["A IA FAZ TUDO?", "Não. E essa é a ideia: você pensa a estratégia, a IA acelera a execução."],
] as const;

function Objections() {
  return (
    <section className="lv2-objections landia-cv-objections">
      <div className="lv2-container">
        <Kicker number="09">SEM PROMESSA MÁGICA</Kicker>
        <Reveal className="lv2-objection-head">
          <div><h2>AS OBJEÇÕES CERTAS<br /><span>MERECEM RESPOSTAS DIRETAS.</span></h2></div>
          <p>O Land-IA não promete que a IA pensa por você. Ele ensina o processo para você dar a ela direção.</p>
        </Reveal>

        <RevealGroup className="lv2-objection-list">
          {OBJECTIONS.map(([question, answer], index) => (
            <article key={question} data-reveal="" style={stepDelay(index)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{question}</h3>
              <p>{answer}</p>
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
    <section className="lv2-decision landia-cv-decision">
      <div className="lv2-container">
        <Kicker number="10" light>A DECISÃO</Kicker>
        <Reveal className="lv2-decision-stage">
          <div className="lv2-decision-bad">
            <small>CONTINUAR COMO ESTÁ</small>
            <h3>ABRIR A IA.<br />TENTAR.<br />CORRIGIR.<br />REPETIR.</h3>
            <span><X /> Cada nova página volta para o zero.</span>
          </div>
          <div className="lv2-decision-arrow" aria-hidden="true">→</div>
          <div className="lv2-decision-good">
            <small>MUDAR A ORDEM</small>
            <h3>DECIDIR.<br />ESTRUTURAR.<br />INSTRUIR.<br />EXECUTAR.</h3>
            <span><Check /> Cada nova página começa com um processo.</span>
          </div>
        </Reveal>
        <Reveal className="lv2-decision-cta">
          <p>Talvez você não precise de outra ferramenta.<br /><strong>Talvez precise aprender a dirigir as que já existem.</strong></p>
          <CTAButton>Quero aprender o processo</CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================
   CTA FINAL / FOOTER
   ================================================================ */
function FinalCTA() {
  return (
    <section className="lv2-final landia-cv-final">
      <div className="lv2-final-grid" aria-hidden="true" />
      <div className="lv2-container">
        <Reveal>
          <span>L// FINAL COMMAND</span>
          <h2>NÃO PEÇA UMA PÁGINA.<br /><strong>PROJETE UMA DECISÃO.</strong></h2>
          <p>A IA já constrói. Agora é sobre dirigir a construção — da oferta ao domínio.</p>
          <CTAButton>Começar agora por R$ 47</CTAButton>
          <small>Pagamento único • acesso imediato</small>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="lv2-footer landia-cv-footer">
      <div className="lv2-container">
        <div><strong>LAND-IA</strong><span>LANDING PAGES COM INTELIGÊNCIA ARTIFICIAL</span></div>
        <p>© {new Date().getFullYear()} LAND-IA. Este produto é um treinamento educacional. Resultados dependem de aplicação, contexto e execução individual.</p>
      </div>
    </footer>
  );
}
