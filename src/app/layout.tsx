import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./sq-theme.css";

const sqHelvetica = localFont({
  src: [
    { path: "../../public/sites/sqdentist/fonts/helvetica-neue-thin.ttf", weight: "100", style: "normal" },
    { path: "../../public/sites/sqdentist/fonts/helvetica-neue-roman.ttf", weight: "400", style: "normal" },
    { path: "../../public/sites/sqdentist/fonts/helvetica-neue-medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-sq-helvetica",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SQ Dentist International | Dental Care in Vietnam",
  description: "Dental implants and tooth restoration at SQ Dentist International in Ho Chi Minh City, Vietnam.",
  robots: { index: false, follow: false },
  icons: { icon: "/sites/sqdentist/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sqHelvetica.variable}>
      <body>{children}</body>
    </html>
  );
}
