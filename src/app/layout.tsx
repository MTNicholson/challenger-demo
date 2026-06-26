import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const nunitoSans = localFont({
  src: [
    { path: "./fonts/nunito-sans-cyrillic.woff2", weight: "400 900", style: "normal" },
    { path: "./fonts/nunito-sans-latin.woff2", weight: "400 900", style: "normal" },
  ],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Челленджер — демо прототип",
  description:
    "Фронтенд-прототип платформы городских челленджей для пользователей и брендов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
