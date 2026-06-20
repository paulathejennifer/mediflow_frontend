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
    }, 7)

    return () => clearInterval(timer)
  }, [cleanText, isAnimated])

  return (
    <p className="text-xs leading-relaxed text-gray-200 whitespace-pre-wrap">
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
    /* Removed custom background colors here so it safely inherits from your master layout */
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* Main Chat Interface Panel */}
      <div className="flex-1 flex flex-col h-full border-r border-gray-800 min-w-0">
        
        {/* Header Bar */}
        <div className="h-16 border-b border-gray-800 px-6 flex items-center justify-between bg-gray-900/40 backdrop-blur shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide text-gray-100">AskMediFlow Operational AI</h1>
              <p className="text-xs text-muted-foreground">Natural Language DB Core translation engine</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearConversation} 
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear Logs
            </Button>
          )}
        </div>

        {/* Conversation Stream Frame */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto pt-12 space-y-8">
              
              {/* Restored Dark Hero Card and Text Visibility */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-10 text-center space-y-4 shadow-xl">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <Sparkles className="h-12 w-12 text-primary relative z-10 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-100">Ask Mediflow AI</h2>
              </div>

              {/* Restored Dark Suggested Action Prompt Cards */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Suggested Analytical Inquiries</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="text-left text-xs p-3.5 bg-gray-900/50 hover:bg-gray-800/80 border border-gray-800/80 rounded-xl transition-all hover:border-primary/40 text-gray-300 shadow-sm"
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
                  /* Restored Dark Message Container Cards */
                  <div
                    key={msg.id}
                    className={`flex gap-4 p-4 rounded-xl border transition-all ${
                      msg.role === 'user'
                        ? 'bg-gray-900/20 border-gray-800/60 ml-12'
                        : 'bg-gray-900/70 border-gray-800/90 mr-12'
                    }`}
                  >
                    <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.role === 'user' 
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {msg.role === 'user' ? 'SA' : 'AI'}
                    </div>
                    <div className="flex-1 space-y-3 overflow-hidden">
                      {msg.role === 'user' ? (
                        <p className="text-xs leading-relaxed text-gray-200 whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      ) : (
                        <TypewriterText text={msg.content} isAnimated={isLatest} />
                      )}
                      
                      {/* Action Triggers for AI SQL Drawer */}
                      {msg.role === 'assistant' && msg.metadata?.generatedSql && (
                        <div className="flex gap-2 pt-2 border-t border-gray-800/50">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px] px-2 bg-gray-950 border-gray-800 text-gray-400 hover:text-white"
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
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 mr-12 flex gap-4 animate-pulse">
                  <div className="h-7 w-7 rounded-md bg-gray-800 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-gray-800 rounded w-1/3" />
                    <div className="h-3 bg-gray-800 rounded w-3/4" />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          )}
        </div>

        {/* Sticky Prompt Input Form Tray with Clean Transparent/Dark Blend */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/40 backdrop-blur sticky bottom-0 z-10 shrink-0 shadow-md">
          <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g., 'How many critical referrals were rejected this week?')..."
              disabled={isLoading}
              className="w-full h-11 bg-gray-900/90 border border-gray-800 rounded-xl pl-4 pr-12 text-xs focus:outline-none focus:border-primary text-gray-100 placeholder:text-gray-500"
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
        <div className="w-80 h-full bg-gray-900 border-l border-gray-800 flex flex-col animate-in slide-in-from-right duration-200 shrink-0">
          <div className="h-16 px-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <Database className="h-4 w-4 text-primary" />
              <span>Query Execution Inspect Log</span>
            </div>
            <button onClick={() => setInspectingData(null)} className="text-xs text-gray-500 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Generated Expression</span>
              <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre">
                {inspectingData.sql}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block flex items-center gap-1">
                <FileJson className="h-3 w-3" /> Database Rows ({inspectingData.raw?.length || 0})
              </span>
              <div className="p-3 bg-gray-950 rounded-lg border border-gray-800 font-mono text-[11px] text-blue-400 max-h-80 overflow-y-auto">
                <pre>{JSON.stringify(inspectingData.raw, null, 2)}</pre>
              </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-900/40 rounded-lg p-3 flex gap-2 text-[11px] text-blue-300/90">
              <ShieldAlert className="h-4 w-4 shrink-0 text-blue-400" />
              <p>Queries are executed using read-only database connections contextually limited by transactional bounds.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}