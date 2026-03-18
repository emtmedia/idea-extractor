import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Extração de Desafios — Gerência de Inovação IDG',
  description: 'Ferramenta de extração de desafios de produtividade por entrevista estruturada',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
