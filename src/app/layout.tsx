import type { Metadata } from 'next'
import '@styles/globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Layout from '@components/Layout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'React Flow App',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang='en' className={inter.variable}>
      <head>
        <link rel='icon' href='/favicon.png' sizes='any' />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
