import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "BitCore — Blog de Estudos",
  description: "Anotações e artigos de estudo sobre redes, sistemas e infraestrutura.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${grotesk.variable} ${inter.variable} ${mono.variable}`}>
      <body className="font-body bg-backdrop text-ink min-h-screen">
        {children}
      </body>
    </html>
  );
}
