import { useContext } from "react"
import { ChatContext } from "@/contexts/ChatContext"

export function useChat() {
  const contexto = useContext(ChatContext)
  if (contexto === undefined) {
    throw new Error("useChat debe usarse dentro de ChatProvider")
  }
  return contexto
}
