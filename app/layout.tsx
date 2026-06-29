import "@mantine/core/styles.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppProvider } from "../components/ui/app-provider";

export const metadata: Metadata = {
  title: "JobClose",
  description: "JobClose local development environment",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
