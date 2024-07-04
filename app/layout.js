import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TMV TV",
  description: "mira eventos deportivos de forma gratuita",
  icons:{
    icon:"/app/favicon.ico"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="min-h-screen">
      <body className={inter.className}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
