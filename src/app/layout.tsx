import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
