"use client"

import { Send } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getApiErrorMessage } from "@/services/errors"
import { queryAI } from "@/services/ai"
import { cn } from "@/lib/utils"

type ChatMessage = {
  id: number
  role: "user" | "assistant"
  content: string
}

export function AIAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const canSend = query.trim().length > 0 && !isLoading

  async function handleSend() {
    const trimmedQuery = query.trim()

    if (!trimmedQuery || isLoading) {
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmedQuery,
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setQuery("")
    setErrorMessage(null)
    setIsLoading(true)

    try {
      const aiResponse = await queryAI({ query: trimmedQuery })
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse.response,
      }

      setMessages((currentMessages) => [...currentMessages, assistantMessage])
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to get a response from the AI assistant."))
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">AI Assistant</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask quick questions about seats, projects, teams, and dashboard metrics.
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex h-[calc(100vh-15rem)] min-h-[480px] flex-col">
            <div className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <p className="text-sm font-semibold text-foreground">No messages yet.</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try asking where an employee is seated or how many seats are available.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                  ))}
                  {isLoading ? (
                    <div className="flex justify-start">
                      <div className="w-full max-w-[80%] rounded-lg border border-border bg-card p-3 shadow-sm">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {errorMessage ? (
              <div className="border-t border-border bg-destructive/10 px-4 py-3 text-sm text-destructive sm:px-6">
                {errorMessage}
              </div>
            ) : null}

            <div className="border-t border-border bg-background p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <textarea
                  className="form-input min-h-20 flex-1 resize-none py-2"
                  value={query}
                  disabled={isLoading}
                  placeholder="Ask something like: Where is Rahul seated?"
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button className="h-10 sm:w-28" disabled={!canSend} onClick={handleSend}>
                  <Send className="size-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-3 text-sm shadow-sm sm:max-w-[70%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-card-foreground",
        )}
      >
        <p className="whitespace-pre-wrap leading-6">{message.content}</p>
      </div>
    </div>
  )
}
