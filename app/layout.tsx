import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "RentFast - Fast Rent Collection",
  description: "Collect rent in 1-3 days. Not 10.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
          {children}
        </div>
      </body>
    </html>
  );
}
