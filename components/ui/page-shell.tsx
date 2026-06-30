"use client";

import { Center } from "@mantine/core";
import type { ReactNode } from "react";

export function PageShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Center component="main" mih="100vh" p="xl" bg="gray.0">
      {children}
    </Center>
  );
}
