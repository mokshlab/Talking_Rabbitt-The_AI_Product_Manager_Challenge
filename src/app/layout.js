import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Talking Rabbitt — Conversational Analytics",
  description:
    "Talk to your data. Upload a CSV, ask questions in plain English, get instant answers with visualizations. Powered by Rabbitt AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexMono.variable} font-mono antialiased`}
        style={{ backgroundColor: "#0a0a0f", color: "#ffffff" }}
      >
        {children}
      </body>
    </html>
  );
}
