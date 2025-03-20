import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import { UserRoleProvider } from "@/components/UserRoleProvider";
import LayoutContent from "@/components/LayoutContent";


export const metadata: Metadata = {
  title: {
    default: "S5 Logistics, Inc",
    template: `%s - S5 Logistics, Inc`,
  },
  description:
    "S5 Logistics, Inc offers seamless and reliable logistics services worldwide, specializing in fast and secure delivery.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <UserRoleProvider>
            <LayoutContent>{children}</LayoutContent>
          </UserRoleProvider>
        </Providers>
      </body>
    </html>
  );
}
