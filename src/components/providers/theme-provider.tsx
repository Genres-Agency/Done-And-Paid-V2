"use client";

import * as React from "react";
import { ThemeProvider as Provider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <Provider {...props}>{children}</Provider>;
}
