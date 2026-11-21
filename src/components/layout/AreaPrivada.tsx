import { ChatProvider } from "@/providers/ChatProvider"
import { VisorProvider } from "@/providers/VisorProvider"
import { AppShell } from "./AppShell"

/** Estado que vive mientras dura la sesión del usuario (se reinicia al cerrar sesión). */
export function AreaPrivada() {
  return (
    <ChatProvider>
      <VisorProvider>
        <AppShell />
      </VisorProvider>
    </ChatProvider>
  )
}
