"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, Sparkles, User, MessageSquare } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_QUESTIONS = [
  "Startups en proteína vegetal",
  "Empresas más financiadas",
  "Agricultura de precisión",
  "Tecnologías en Cataluña",
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll al final cuando hay nuevos mensajes
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

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
    <Card className="!p-0 !gap-0 flex flex-col h-[380px] w-full max-w-3xl mx-auto shadow-xl border border-border/50 overflow-hidden bg-background">
      {/* Header - Compact */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-background backdrop-blur-md shrink-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary shadow-md shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold leading-tight text-foreground">Asistente Vaireo</h2>
        </div>
      </div>

      {/* Messages Container - Native scroll */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overscroll-contain px-3 py-2.5 scroll-smooth"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className={messages.length === 0 ? "h-full flex items-center justify-center" : "space-y-3"}>
          {/* Welcome State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted mb-2 shadow-inner">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold mb-1 text-foreground text-lg">Asistente Vaireo</h3>
              <p className="text-muted-foreground max-w-sm leading-snug mb-2.5 text-sm">
                Información sobre startups agroalimentarias y el sector.
              </p>
              
              {/* Suggested Questions */}
              <div className="w-full max-w-md">
                <div className="grid grid-cols-2 gap-1.5">
                  {SUGGESTED_QUESTIONS.map((question, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-center text-[10px] px-2 py-1.5 rounded-md bg-muted hover:bg-accent border border-border hover:border-primary transition-all text-muted-foreground hover:text-foreground leading-tight"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 items-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 shadow-md shrink-0 mt-0.5 ring-2 ring-background">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`rounded-2xl px-4 py-3 max-w-[75%] min-w-0 shadow-md ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card text-card-foreground border border-border rounded-bl-sm"
                }`}
              >
                {message.role === "user" ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                ) : (
                  <div className="text-sm leading-relaxed prose prose-sm prose-neutral dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ol]:mb-2 [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-2 [&>h2]:text-sm [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1 [&>ul]:pl-4 [&>ol]:pl-4 [&>li]:mb-0.5 [&>strong]:font-semibold [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <Avatar className="w-8 h-8 shadow-md shrink-0 mt-0.5 ring-2 ring-background">
                  <AvatarFallback className="bg-muted">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex gap-3 items-start justify-start animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <Avatar className="w-8 h-8 shadow-md shrink-0 mt-0.5 ring-2 ring-background">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-card border border-border shadow-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    Pensando
                    <span className="flex gap-0.5">
                      <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form - Compact */}
      <form onSubmit={handleSubmit} className="px-3 py-1.5 border-t bg-background backdrop-blur-md shrink-0">
        <div className="flex gap-2 items-center">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 min-h-[36px] max-h-[60px] resize-none text-sm rounded-lg border-border bg-muted focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm transition-all py-1.5 px-3"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-[36px] w-[36px] shrink-0 rounded-lg shadow-md bg-primary hover:bg-primary hover:opacity-90 hover:shadow-lg transition-all"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </form>
    </Card>
  )
}
