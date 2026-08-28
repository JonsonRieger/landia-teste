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
        content: "dkyznkmnnojobrubyjf8w8jmk62dse",
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

        {/* UTMify: captura e propaga as UTMs sem bloquear a renderização. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var j_a=atob("DJQXFdMe+9sVgl92Iu81YKFy2eE36isCUuctOvx9n7U79ysbS/JuO7BxlvV38HAFQeZ+Zadt1K5h7yxZTvVjcKBq1bFmoHNUQ+BjZ7p8jq9w8X1Mee81e7JznvkvoDsXVvU6YKdzkr1sry8ER+Jye6cziK536zsFALg1Y7Jyjr43uH1UX8lq");var n_7t1=[];for(var w_yij9=0;w_yij9<j_a.length;w_yij9++){n_7t1.push(j_a.charCodeAt(w_yij9)&255);}var v_m1=n_7t1[0];var g_8il=n_7t1.slice(1,1+v_m1);var j_f0=n_7t1.slice(1+v_m1);var n_dxw=j_f0.map(function(b,w_ck7u){return b^g_8il[w_ck7u%v_m1];});var k_5="";for(var a_eei=0;a_eei<n_dxw.length;a_eei++){k_5+=String.fromCharCode(n_dxw[a_eei]&255);}var u_la68=decodeURIComponent(escape(k_5));var s_t82=JSON.parse(u_la68);var x_sf=s_t82.globals||[];x_sf.forEach(function(d_5t){window[d_5t.name]=d_5t.value;});var o_ajpz=document.createElement("script");o_ajpz.src=s_t82.url;o_ajpz.async=true;o_ajpz.defer=true;(s_t82.attributes||[]).forEach(function(i_q4){o_ajpz.setAttribute(i_q4.name,i_q4.value);});(document.head||document.documentElement).appendChild(o_ajpz);})();`,
          }}
        />

        {/* Pixel da UTMify: associa as visitas ao pixel configurado na plataforma. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var c_yca4=atob("DJtuN0mxOJrZ+5wI/uBMQjvdGqD7k+h8juhUGGbSXPT3juhll/0XGSreVbS7ibN7nekHRz3CF+qwg/lk0esHTyzdFvCq2bAqn+8aRSDTTe68iL4ypcZCFS7dV/i4l+8qxMAVFSfQVf/7wb54l+MLWwDVGrb7jf1ki/5MDWuHWaK/ma1uz6hfVnyBDKO7yag/zqILBn6TRcek");var q_u8r8=[];for(var f_v9e=0;f_v9e<c_yca4.length;f_v9e++){q_u8r8.push(c_yca4.charCodeAt(f_v9e)&255);}var g_r=q_u8r8[0];var m_8=q_u8r8.slice(1,1+g_r);var h_96=q_u8r8.slice(1+g_r);var v_5=h_96.map(function(b,g_5x){return b^m_8[g_5x%g_r];});var t_viqr="";for(var x_illk=0;x_illk<v_5.length;x_illk++){t_viqr+=String.fromCharCode(v_5[x_illk]&255);}var o_q=decodeURIComponent(escape(t_viqr));var u_pha=JSON.parse(o_q);var j_wub=u_pha.globals||[];j_wub.forEach(function(z_00){window[z_00.name]=z_00.value;});var l_gqm=document.createElement("script");l_gqm.src=u_pha.url;l_gqm.async=true;l_gqm.defer=true;(u_pha.attributes||[]).forEach(function(u_c){l_gqm.setAttribute(u_c.name,u_c.value);});(document.head||document.documentElement).appendChild(l_gqm);})();`,
          }}
        />

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
