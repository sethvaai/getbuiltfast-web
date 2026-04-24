import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GetBuiltFast — Your Website Live in 48 Hours",
  description:
    "AI-powered web agency delivering stunning, production-ready websites from €499. Landing pages, e-commerce, SaaS dashboards — built fast.",
  keywords: "web agency, website design, fast delivery, 48 hours, landing page, e-commerce, SaaS",
  openGraph: {
    title: "GetBuiltFast — Your Website Live in 48 Hours",
    description:
      "AI-powered web agency delivering stunning, production-ready websites from €499.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Anti-flash: read theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} antialiased`}
        style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
      >
        {children}
      </body>
    </html>
  );
}
