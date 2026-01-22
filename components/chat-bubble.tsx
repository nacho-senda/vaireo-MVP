"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

function sendMessage(message: { text: string }) {
  // Placeholder for sendMessage function implementation
}

export function ChatBubble() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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
        throw new Error(`HTTP ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader")

      const decoder = new TextDecoder()
      const assistantId = (Date.now() + 1).toString()
      let assistantMessage: Message | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

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
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...assistantMessage! } : m))
            )
          }
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Error al procesar tu pregunta. Inténtalo de nuevo.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // No mostrar en la pagina de inicio donde ya hay ChatInterface
  if (pathname === "/") {
    return null
  }

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
          <SheetHeader className="p-3 border-b">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
              </Avatar>
              <SheetTitle className="text-base">Asistente Vaireo</SheetTitle>
            </div>
          </SheetHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div ref={scrollRef} className="p-3 space-y-4">
                {messages.length === 0 && (
                  <div className="py-4 space-y-4">
                    <div className="text-center text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">¡Hola! Soy Vaireo</p>
                      <p>Tu asistente experto en el ecosistema agroalimentario español.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground text-center">Prueba a preguntarme:</p>
                      <div className="flex flex-col gap-1.5">
                        {[
                          "¿Qué startups trabajan en proteína vegetal?",
                          "Muéstrame empresas de agricultura de precisión",
                          "¿Cuáles son las startups más financiadas?",
                          "¿Qué tecnologías dominan en Cataluña?"
                        ].map((suggestion, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setInput(suggestion)
                            }}
                            className="text-left text-xs px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-7 w-7 bg-primary shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      {message.role === "user" ? (
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      ) : (
                        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ol]:mb-2 [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-sm [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1 [&>ul]:pl-4 [&>ol]:pl-4 [&>li]:mb-0.5 [&>strong]:font-semibold [&>code]:bg-background [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-7 w-7 bg-muted shrink-0">
                        <AvatarFallback className="text-xs">TÚ</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 justify-start">
                    <Avatar className="h-7 w-7 bg-primary shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="border-t p-2">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                className="min-h-[48px] max-h-[120px] resize-none text-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                className="h-[48px] w-[48px] shrink-0"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
