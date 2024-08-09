import { Inter as FontSans } from "next/font/google"
import './globals.css'

import { cn } from "@/lib/utils"
import {Metadata} from "next";
import {ClerkProvider} from "@clerk/nextjs";
import {dark} from "@clerk/themes";
import Provider from "@/app/Provider";
import React from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
    title: 'LiveCollaborate',
    description: 'LiveCollaborate offers a comprehensive platform for teams to work on documents in real-time. Enhance your collaboration and streamline your projects.'
}

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
      <ClerkProvider
        appearance={{
            baseTheme: dark,
            variables: {
                colorPrimary: "#3371FF",
                fontSize: "16px"
            },

        }}
      >
          <html lang="en" suppressHydrationWarning>
              <body
                  className={cn(
                      "min-h-screen font-sans antialiased",
                      fontSans.variable
                  )}
              >
              <Provider>
                  {children}
              </Provider>
              </body>
          </html>
      </ClerkProvider>
  )
}

