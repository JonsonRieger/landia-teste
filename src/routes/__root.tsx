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
              t=b.createElement(e);
              t.async=!0;
              t.src=v;
              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '2148386099070117');
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
