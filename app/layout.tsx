import type { Metadata } from "next"
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google"
import "./tailwind.css"
import "./globals.scss"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seb.bz"

// Static — content is author-controlled, no user input involved
const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sebastián",
  url: SITE_URL,
  jobTitle: "Full-Stack Engineer & Creative Developer",
  sameAs: ["https://www.linkedin.com/in/sebbz/", "https://github.com/sebbz"],
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sebastián · Full-Stack Engineer & Creative Developer",
  description:
    "Full-stack engineer with 7 years of experience building polished interfaces with React, TypeScript, and AI-powered workflows.",
  keywords: [
    "full-stack engineer",
    "frontend developer",
    "React",
    "TypeScript",
    "Next.js",
    "creative developer",
    "portfolio",
  ],
  authors: [{ name: "Sebastián" }],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Sebastián · Full-Stack Engineer & Creative Developer",
    description:
      "Full-stack engineer with 7 years of experience building polished interfaces with React, TypeScript, and AI-powered workflows.",
    url: SITE_URL,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sebastián · Full-Stack Engineer & Creative Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebastián · Full-Stack Engineer & Creative Developer",
    description:
      "Full-stack engineer with 7 years of experience building polished interfaces with React, TypeScript, and AI-powered workflows.",
    images: [`${SITE_URL}/opengraph-image`],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/favicon/apple-touch-icon.png" },
    other: [
      { rel: "manifest", url: "/favicon/site.webmanifest" },
      {
        rel: "icon",
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}>
      <head>
        {/* JSON-LD structured data — static content, safe to use dangerouslySetInnerHTML */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
