"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, Sparkles, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ChatInterface() {
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const isLoading = status === "in_progress"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    sendMessage({ text: input })
    setInput("")
  }

  return (
    <Card className="flex flex-col h-[450px] w-full max-w-4xl mx-auto shadow-lg border-2">
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-primary/5">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Asistente Vaireo</h2>
          <p className="text-xs text-muted-foreground">Experto en ecosistema agroalimentario</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-3">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">¡Hola! Soy tu asistente Vaireo</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Puedo ayudarte con información sobre startups agroalimentarias, análisis de datos, tendencias del
                  sector y mucho más.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="w-7 h-7 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Sparkles className="w-3.5 h-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground border"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <p key={index} className="text-sm leading-relaxed whitespace-pre-wrap">
                          {part.text}
                        </p>
                      )
                    }
                    return null
                  })}
                </div>

                {message.role === "user" && (
                  <Avatar className="w-7 h-7 border-2 border-primary/20">
                    <AvatarFallback className="bg-secondary">
                      <User className="w-3.5 h-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <Avatar className="w-7 h-7 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles className="w-3.5 h-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-3 py-2 bg-muted border">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t bg-background">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntame sobre startups, análisis, tendencias..."
            className="min-h-[48px] max-h-[96px] resize-none text-sm"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as any)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-[48px] w-[48px] shrink-0"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">Enter para enviar • Shift+Enter para nueva línea</p>
      </form>
    </Card>
  )
}
