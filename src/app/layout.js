import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import DynamicRouteHandler from "./components/DynamicRouteHandler";
import VisitorTracker from "./components/VisitorTracker";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Forever Security - Your Trusted Security Partner",
  description: "Professional security services for your business and home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <VisitorTracker />
        <DynamicRouteHandler>{children}</DynamicRouteHandler>
      </body>
    </html>
  );
}
