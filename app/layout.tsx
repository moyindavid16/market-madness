import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {SignedIn, SignedOut, SignInButton} from "@clerk/nextjs";
import Providers from "./providers";

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
            <SignInButton signUpForceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL} />
          </SignedOut>
          <SignedIn>{children}</SignedIn>
        </body>
      </html>
    </Providers>
  );
}
