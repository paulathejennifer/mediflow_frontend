'use client'

import { useState, useRef, useEffect } from 'react'
import { useAskAI } from '@/features/analytics/hooks/useAskAI'
import { Button } from '@/components/ui/button'
import { Sparkles, Send, Database, Terminal, Trash2, ShieldAlert, FileJson } from 'lucide-react'

const SUGGESTED_PROMPTS = [
  "How many referrals are currently marked as emergency?",
  "Which facility has received the most referrals this month?",
  "Show me the duplicate patient pairs that are still flagged.",
  "List patients born after 2000 who have completed status referrals."
]

/**
 * Custom text presenter that strips raw markdown characters (like **)
 * and outputs smooth character streaming mimicking real-time typing.
 */
function TypewriterText({ text, isAnimated = true }: { text: string; isAnimated?: boolean }) {
  // Strip out ugly markdown bold tags (**) to ensure a clean text layout
  const cleanText = text.replace(/\*\*/g, '')
  const [displayedText, setDisplayedText] = useState(isAnimated ? '' : cleanText)

  useEffect(() => {
    if (!isAnimated) {
      setDisplayedText(cleanText)
      return
    }

    let index = 0
    setDisplayedText('')

    const timer = setInterval(() => {
      if (index < cleanText.length) {
        setDisplayedText((prev) => prev + cleanText.charAt(index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 7) // Snappy character-by-character render velocity

    return () => clearInterval(timer)
  }, [cleanText, isAnimated])

  return (
    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
      {displayedText}
    </p>
  )
}

export default function AskAIPage() {
  const [input, setInput] = useState('')
  const { messages, isLoading, sendMessage, clearConversation } = useAskAI()
  const [inspectingData, setInspectingData] = useState<{ sql?: string; raw?: any[] } | null>(null)
  
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background text-foreground overflow-hidden relative">
      {/* Main Chat Interface Panel */}
      <div className="flex-1 flex flex-col h-full border-r border-border min-w-0">
        
        {/* Header Bar */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/40 backdrop-blur shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide text-foreground">AskMediFlow Operational AI</h1>
              <p className="text-xs text-muted-foreground">Natural Language DB Core translation engine</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearConversation} 
              className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear Logs
            </Button>
          )}
        </div>

        {/* Conversation Stream Frame */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto pt-12 space-y-8">
              
              {/* Simplified Glowing Hero Component */}
              <div className="bg-card border border-border rounded-xl p-10 text-center space-y-4 shadow-sm">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <Sparkles className="h-12 w-12 text-primary relative z-10 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Ask MediFlow AI</h2>
              </div>

              {/* Suggested Analytical Actions */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Analytical Inquiries</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="text-left text-xs p-3.5 bg-card hover:bg-muted/80 border border-border rounded-xl transition-all hover:border-primary/40 text-foreground shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((msg, index) => {
                const isLatest = index === messages.length - 1
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-4 p-4 rounded-xl border transition-all ${
                      msg.role === 'user'
                        ? 'bg-muted/40 border-border/60 ml-12'
                        : 'bg-card border-border mr-12 shadow-sm'
                    }`}
                  >
                    <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.role === 'user' 
                        ? 'bg-secondary text-secondary-foreground border border-border' 
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {msg.role === 'user' ? 'SA' : 'AI'}
                    </div>
                    <div className="flex-1 space-y-3 overflow-hidden">
                      {msg.role === 'user' ? (
                        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      ) : (
                        <TypewriterText text={msg.content} isAnimated={isLatest} />
                      )}
                      
                      {/* Extra Actions for AI SQL Inspection Results */}
                      {msg.role === 'assistant' && msg.metadata?.generatedSql && (
                        <div className="flex gap-2 pt-2 border-t border-border/50">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px] px-2 bg-background border-border text-muted-foreground hover:text-foreground"
                            onClick={() => setInspectingData({ sql: msg.metadata?.generatedSql, raw: msg.metadata?.rawData })}
                          >
                            <Terminal className="h-3 w-3 mr-1" /> View SQL Engine Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {isLoading && (
                <div className="bg-card/60 border border-border rounded-xl p-4 mr-12 flex gap-4 animate-pulse">
                  <div className="h-7 w-7 rounded-md bg-muted shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-3/4" />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          )}
        </div>

        {/* Sticky Prompt Input Form Tray */}
        <div className="p-4 border-t border-border bg-card sticky bottom-0 z-10 shrink-0 shadow-md">
          <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g., 'How many critical referrals were rejected this week?')..."
              disabled={isLoading}
              className="w-full h-11 bg-background border border-border rounded-xl pl-4 pr-12 text-sm focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 top-1.5 h-8 w-8 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Database Metadata Inspection Drawer Context Panel */}
      {inspectingData && (
        <div className="w-80 h-full bg-card border-l border-border flex flex-col animate-in slide-in-from-right duration-200 shrink-0">
          <div className="h-16 px-4 border-b border-border flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Database className="h-4 w-4 text-primary" />
              <span>Query Execution Inspect Log</span>
            </div>
            <button onClick={() => setInspectingData(null)} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Code Output Segment (Uses proper dark slate text-editor box style) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Generated Expression</span>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre">
                {inspectingData.sql}
              </div>
            </div>

            {/* Raw JSON Dataset Segment */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
                <FileJson className="h-3 w-3" /> Database Rows ({inspectingData.raw?.length || 0})
              </span>
              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-[11px] text-blue-400 max-h-80 overflow-y-auto">
                <pre>{JSON.stringify(inspectingData.raw, null, 2)}</pre>
              </div>
            </div>

            {/* Read-Only Safety assurance context */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex gap-2 text-[11px] text-muted-foreground">
              <ShieldAlert className="h-4 w-4 shrink-0 text-primary" />
              <p>Queries are executed using read-only database connections contextually limited by transactional bounds.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}