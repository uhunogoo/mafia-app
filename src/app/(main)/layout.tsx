import { Geist } from "next/font/google";

import AppNav from "@/components/app-nav";
import { AppLayout } from "@/components/app-layout";
import AppFooter from "@/components/app-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppNav />
      <AppLayout className={`${geistSans.className} antialiased`}>
        {children}
      </AppLayout>
      <AppFooter />
    </>
  );
}
