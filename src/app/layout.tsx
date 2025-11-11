import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat,Inter} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat=Montserrat({
    subsets:['latin']
});
const inter=Inter({
    subsets:['latin']
})

export const metadata: Metadata = {
  title: "Rolio - Job Tracker",
  description: "The best job tracking platform out there. Easily keep records of all the job that you have applied.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
