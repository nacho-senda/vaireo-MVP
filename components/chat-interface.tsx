"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, Sparkles, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No se pudo leer la respuesta")
      }

      const decoder = new TextDecoder()

      const assistantId = Date.now().toString()
      let assistantMessage: Message | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        const text = decoder.decode(value, { stream: true })
        if (text) {
          if (!assistantMessage) {
            assistantMessage = {
              id: assistantId,
              role: "assistant",
              content: text,
            }
            setMessages((prev) => [...prev, assistantMessage!])
          } else {
            assistantMessage.content += text
            setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...assistantMessage! } : m)))
          }
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Ocurrió un error inesperado"}`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[480px] w-full max-w-4xl mx-auto shadow-lg border-0 overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background/95 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold leading-tight text-foreground truncate">Asistente Vaireo</h2>
          <p className="text-xs text-muted-foreground leading-tight flex items-center gap-1.5 truncate">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <span className="truncate">En línea • Experto en agroalimentación</span>
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0">
        <ScrollArea className="h-full px-4 py-4" ref={scrollRef}>
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-3 shadow-sm">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-base font-bold mb-2 text-foreground">¡Hola! Soy tu asistente Vaireo</h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed px-4">
                  Estoy aquí para ayudarte con información sobre startups agroalimentarias, análisis del sector y
                  tendencias del mercado.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2.5 items-start min-w-0 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-7 h-7 shadow-sm shrink-0 mt-0.5">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      <Sparkles className="w-3.5 h-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-2xl px-3.5 py-2.5 max-w-[80%] min-w-0 shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md"
                      : "bg-card text-card-foreground border border-border/50 rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {message.content}
                  </p>
                </div>

                {message.role === "user" && (
                  <Avatar className="w-7 h-7 shadow-sm shrink-0 mt-0.5">
                    <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/80">
                      <User className="w-3.5 h-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-start justify-start min-w-0">
                <Avatar className="w-7 h-7 shadow-sm shrink-0 mt-0.5">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    <Sparkles className="w-3.5 h-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl rounded-bl-md px-3.5 py-2.5 bg-card border border-border/50 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      Pensando
                      <span className="flex gap-1">
                        <span className="inline-block w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="inline-block w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="inline-block w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t bg-background/95 backdrop-blur-sm shrink-0">
        <div className="flex gap-2.5 items-end">
          <div className="flex-1 relative min-w-0">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              className="min-h-[48px] max-h-[96px] resize-none text-sm rounded-xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="h-[48px] w-[48px] shrink-0 rounded-xl shadow-md bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5 leading-tight px-1 truncate">
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-muted rounded">Enter</kbd> enviar •{" "}
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-muted rounded">Shift+Enter</kbd> nueva línea
        </p>
      </form>
    </Card>
  )
}
