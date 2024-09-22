import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {SignedIn, SignedOut, SignInButton} from "@clerk/nextjs";
import Providers from "./providers";
import {Button} from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster"

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-ExtraBold.ttf",
  variable: "--font-jetbrains-mono",
  weight: "100 900",
})
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  "use client";
  return (
    <Providers>
      <html lang="en">
        <body className={`${jetbrainsMono.variable} ${jetbrainsMono.variable} antialiased w-full h-full`}>
          <SignedOut>
            <div className="flex flex-col justify-center items-center h-screen space-y-4 relative z-10">
              <h1 className="text-8xl font-bold">MARKET MADNESS</h1>
              <Button variant="outline" className="h-8 px-8 text-md">
                <SignInButton signUpForceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL} />
              </Button>
            </div>
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-800 to-zinc-900 animate-gradient-x" />
              <div className="absolute inset-0">
                <div className="absolute inset-0 animate-pulse">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiIC8+PC9zdmc+')] bg-repeat opacity-50"/>
                </div>
              </div>
              <div className="absolute inset-0 bg-black opacity-10"/>
            </div>
          </SignedOut>
          <SignedIn>{children}
            <Toaster />
          </SignedIn>
        </body>
      </html>
    </Providers>
  );
}
