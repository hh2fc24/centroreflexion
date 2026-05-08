"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useContent } from "@/lib/editor/hooks";

function sanitizeTrackingId(input: string, kind: "ga" | "gtm" | "pixel") {
  const raw = input.trim();
  if (!raw) return "";
  if (kind === "pixel") return /^\d{5,20}$/.test(raw) ? raw : "";
  return /^[A-Za-z0-9_-]{4,40}$/.test(raw) ? raw : "";
}

export function IntegrationsScripts() {
  const pathname = usePathname();
  const { content } = useContent();

  if (pathname.startsWith("/admin")) return null;

  const gaId = sanitizeTrackingId(content.integrations?.googleAnalyticsId || "", "ga");
  const gtmId = sanitizeTrackingId(content.integrations?.googleTagId || "", "gtm");
  const pixelId = sanitizeTrackingId(content.integrations?.metaPixelId || "", "pixel");

  return (
    <>
      {/* Google Tag Manager */}
      {gtmId ? (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer',${JSON.stringify(gtmId)});
            `}
          </Script>
        </>
      ) : null}

      {/* Google Analytics (gtag) */}
      {gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(gaId)});
            `}
          </Script>
        </>
      ) : null}

      {/* Meta Pixel */}
      {pixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${JSON.stringify(pixelId)});
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
