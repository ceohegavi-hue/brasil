import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"

const cameraFont = localFont({
  src: "../public/fonts/CameraPlainVariable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-camera",
})

export const metadata: Metadata = {
  title: "(Compre 1 leve 2) Camisa do Brasil Copa 2026 - CBF Store",
  description:
    "Vista a paixão nacional com a Camisa do Brasil Home + Away 2026. Compre 1 e leve 2 com 87% de desconto e frete grátis.",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${cameraFont.variable} bg-background`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
