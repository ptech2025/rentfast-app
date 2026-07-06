import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RentFast - Fast Rent Collection",
  description: "Collect rent in 1-3 days. Not 10.",
};

export default function RootLayout({ children }) {
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
