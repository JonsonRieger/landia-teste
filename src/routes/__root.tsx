import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?inline";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },

      { name: "viewport", content: "width=device-width, initial-scale=1" },

      {
        name: "facebook-domain-verification",
        content: "6wxcejrbia5huwp39q1i01y2rixjk0",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon-landia.ico", type: "image/x-icon" },
      { rel: "shortcut icon", href: "/favicon-landia.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      // As fontes do primeiro viewport (Inter 400, Poppins 600/700 — subset latin)
      // agora vão embutidas em base64 no CSS crítico inline: zero requisição de
      // rede e nenhum re-render de texto por swap de fonte no caminho do LCP.
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* CSS crítico inline: elimina a requisição render-blocking do stylesheet. */}
        <style dangerouslySetInnerHTML={{ __html: appCss }} />
        <HeadContent />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;
              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];
              // O stub acima enfileira TODOS os eventos (fbq('init'), 'track', ...).
              // O fbevents.js processa a fila depois de carregado. Mantemos o stub
              // imediatamente disponível, mas adiamos o download do script pesado para
              // depois da janela crítica do LCP. Interação real continua carregando na hora.
              var loaded=!1;
              function load(){
                if(loaded)return;loaded=!0;
                if(fallbackTimer)f.clearTimeout(fallbackTimer);
                t=b.createElement(e);
                t.async=!0;
                t.src='https://connect.facebook.net/en_US/fbevents.js';
                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s);
              }
              // Fora de interação, o script pesado da Meta só entra depois de 8s.
              // Isso preserva a fila do fbq e tira o fbevents.js da janela crítica
              // de LCP/TBT. Qualquer interação real continua carregando imediatamente.
              var fallbackTimer=f.setTimeout(function(){
                if(f.requestIdleCallback){f.requestIdleCallback(load,{timeout:2000});}
                else{load();}
              },8000);
              ['pointerdown','touchstart','keydown','scroll'].forEach(function(ev){
                f.addEventListener(ev,load,{once:!0,passive:!0});
              });
            }(window, document,'script');

            fbq('init', '2148386099070117');
            console.log("Facebook Pixel inicializado");
            `,
          }}
        />


        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2148386099070117&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

      </head>

      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Required: nested routes render here. Removing <Outlet /> breaks all child routes.
  return <Outlet />;
}
