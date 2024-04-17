import "@styles/globals.css";
import NProgressWrapper from "@components/nprogress-wrapper";
import PWALifeCycle from "@components/pwa-lifecycle";
import SentryProvider from "@components/sentry-provider";
import NextThemeProvider from "@components/theme-provider";
import { twindConfig, type ColorRecordType } from "@lib/twind";
import { cn, fontInter } from "@lib/utils";
import { Toaster } from "@ui/toaster";
import type { Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { AxiomWebVitals } from "next-axiom";
import Script from "next/script";
import type { PropsWithChildren } from "react";

export const runtime = "edge";

export const viewport: Viewport = {
  themeColor: [
    {
      color: (twindConfig.colors.neutral as ColorRecordType)[50],
      media: "(prefers-color-scheme: light)",
    },
    {
      color: (twindConfig.colors.neutral as ColorRecordType)[900],
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export const metadata = {
  title: {
    default: "To-do list",
    template: "%s | To-do list",
  },
  description: "Managing your tasks has never been simpler before.",

  metadataBase: new URL("https://todo.k1ng.dev"),
  manifest: "/static/manifest.json",
  openGraph: {
    images: ["/static/images/og.webp"],
  },

  icons: {
    icon: [
      {
        url: "/static/favicons/favicon.ico",
      },
    ],
    apple: [
      {
        url: "/static/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={cn("font-sans antialiased", fontInter.variable)}
      suppressHydrationWarning
    >
      <head>
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              strategy="lazyOnload"
              data-website-id="338df046-c426-48aa-b730-f3c253e6e0c5"
              src="https://insights.k1ng.dev/script.js"
            />
            <AxiomWebVitals />
          </>
        )}
      </head>
      <body className="flex min-h-dvh flex-col">
        <NextThemeProvider>
          <NProgressWrapper>
            <SessionProvider>
              {children}
              <Toaster />
              {process.env.NODE_ENV === "production" && <SentryProvider />}
            </SessionProvider>
          </NProgressWrapper>
        </NextThemeProvider>

        <PWALifeCycle />
      </body>
    </html>
  );
}

export default RootLayout;
