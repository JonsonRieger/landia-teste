import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

// A demonstração é inteiramente local. Não consome créditos nem envia eventos.
const CREDIT_STAGES = [
  {
    credits: 5,
    prompt: "Crie uma página atraente e de alta conversão.",
    title: "A expectativa está lá em cima.",
    thought: "Você imagina sua oferta no ar. A IA entrega frases que poderiam estar na página de qualquer pessoa.",
    headline: "Sua jornada de transformação começa aqui.",
    button: "SAIBA MAIS",
  },
  {
    credits: 3,
    prompt: "Não gostei. Deixa mais profissional. Mais impactante.",
    title: "Mudou a aparência. E só.",
    thought: "A cor ficou melhor. O título também mudou. Mas você ainda não sabe por que alguém compraria ali.",
    headline: "Eleve seu negócio ao próximo nível.",
    button: "DESCUBRA MAIS",
  },
  {
    credits: 1,
    prompt: "Troca a headline. Mexe nas cores. Melhora esse botão.",
    title: "Agora você tem medo de pedir de novo.",
    thought: "Falta pouco saldo. Você começa a aceitar o que não gostou só para não perder tudo o que já fez.",
    headline: "Resultados incríveis esperam por você.",
    button: "CLIQUE AQUI",
  },
  {
    credits: 0,
    prompt: "Agora só falta mais um ajustezinho…",
    title: "Acabou o crédito. Sobrou o “quase”.",
    thought: "Você gastou tempo, energia e saldo. E a página ainda não dá ao cliente um motivo claro para comprar.",
    headline: "SEJA BEM-VINDO. AGORA VAI EMBORA.",
    button: "QUERO DESISTIR DA COMPRA",
  },
] as const;

export default function CreditLoop() {
  const [step, setStep] = useState(0);
  const stage = CREDIT_STAGES[step];
  const isDepleted = step === CREDIT_STAGES.length - 1;

  return (
    <div
      className="forge-credit-lab"
      data-credit-step={step}
      data-depleted={isDepleted ? "true" : "false"}
      role="group"
      aria-labelledby="credit-lab-title"
    >
      <div className="forge-credit-lab-top">
        <div>
          <span className="forge-credit-dots" aria-hidden="true"><i /><i /><i /></span>
          <h3 id="credit-lab-title">O CICLO DO “SÓ MAIS UM AJUSTE”</h3>
        </div>
        <span className="forge-credit-step-count">0{step + 1} / 04</span>
      </div>

      <div className="forge-credit-lab-body">
        <div className="forge-credit-balance">
          <div>
            <span>SALDO ILUSTRATIVO</span>
            <div className="forge-credit-meter" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((slot) => (
                <i key={slot} data-spent={slot >= stage.credits ? "true" : "false"} />
              ))}
            </div>
          </div>
          <div className="forge-credit-counter" aria-label={`${stage.credits} créditos nesta simulação`}>
            <strong>{String(stage.credits).padStart(2, "0")}</strong>
            <span>créditos</span>
          </div>
        </div>

        <div id="credit-loop-message" className="forge-credit-message" aria-live="polite" aria-atomic="true">
          <span className="forge-credit-sr-only">Etapa {step + 1} de 4. Saldo ilustrativo: {stage.credits} créditos.</span>
          <div key={step} className="forge-credit-stage">
            <blockquote className="forge-credit-prompt">
              <span>VOCÊ PEDE</span>
              <p>“{stage.prompt}”</p>
            </blockquote>
            <div className="forge-credit-thought">
              <strong>{stage.title}</strong>
              <p>{stage.thought}</p>
            </div>
          </div>
        </div>

        <div id="credit-loop-preview" className="forge-credit-preview" data-satire={isDepleted ? "true" : "false"}>
          <div className="forge-credit-preview-bar">
            <span>{isDepleted ? "O QUE SUA PÁGINA ACABA DIZENDO" : "PRÉVIA DA PÁGINA GENÉRICA"}</span>
            <span>{isDepleted ? "SÁTIRA" : "EXEMPLO"}</span>
          </div>
          <div className="forge-credit-mini-hero">
            <span className="forge-credit-mini-brand">{isDepleted ? "PÁGINA DE VISITAS™" : "SUA MARCA AQUI"}</span>
            <p key={step} className="forge-credit-mini-headline">{stage.headline}</p>
            <span className="forge-credit-mini-button">{stage.button} <ArrowRight aria-hidden="true" /></span>
          </div>
        </div>

        <button
          type="button"
          className="forge-credit-try"
          aria-controls="credit-loop-message credit-loop-preview"
          onClick={() => setStep((current) => (current + 1) % CREDIT_STAGES.length)}
        >
          <span>{isDepleted ? "RECOMEÇAR A SIMULAÇÃO" : step === 2 ? "PEDIR O ÚLTIMO AJUSTE" : "PEDIR MAIS UM AJUSTE"}</span>
          {isDepleted ? <RotateCcw aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
        </button>
        <p className="forge-credit-lab-note">Simulação ilustrativa. O consumo real de créditos varia conforme a solicitação.</p>
      </div>
    </div>
  );
}
