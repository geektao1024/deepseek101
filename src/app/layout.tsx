import './globals.css'
import { Layout } from '@/components/Layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'LemoBook - Open Source Dynamic Website CMS',
    template: '%s | LemoBook'
  },
  description: 'A Next.js site with Tailwind & Shadcn/UI, using GitHub API for content management. No database needed for dynamic updates.',
  keywords: ['Next.js', 'React', 'GitHub API', 'CMS', 'Open Source'],
  authors: [{ name: 'Lemo', url: 'https://github.com/lemoabc' }],
  creator: 'Lemo',
  publisher: 'Lemo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lemobook.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'zh-CN': '/zh-CN',
    },
  },
  openGraph: {
    title: 'LemoBook - Open Source Dynamic Website CMS',
    description: 'A Next.js site with Tailwind & Shadcn/UI, using GitHub API for content management.',
    url: 'https://lemobook.vercel.app',
    siteName: 'LemoBook',
    images: [
      {
        url: '/images/web.webp',
        width: 1200,
        height: 630,
        alt: 'LemoBook Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LemoBook - Open Source Dynamic Website CMS',
    description: 'A Next.js site with Tailwind & Shadcn/UI, using GitHub API for content management.',
    images: ['/images/web.webp'],
    creator: '@lemoabc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon-16x16.png',
    other: {
      rel: 'icon',
      url: '/favicon-16x16.png',
    },
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-site-verification',
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="" href="/favicon.svg" />
        <link rel="shortcut icon" type="" href="/favicon.svg" />
        <link rel="alternate" href="https://lemobook.vercel.app" hrefLang="x-default" />
        <link rel="alternate" href="https://lemobook.vercel.app/en-US" hrefLang="en-US" />
        <link rel="alternate" href="https://lemobook.vercel.app/zh-CN" hrefLang="zh-CN" />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}