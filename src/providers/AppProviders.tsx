import type { ReactNode } from "react"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "./AuthProvider"
import { SaludProvider } from "./SaludProvider"
import { ThemeProvider } from "./ThemeProvider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SaludProvider>
          <TooltipProvider delayDuration={250}>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </SaludProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
