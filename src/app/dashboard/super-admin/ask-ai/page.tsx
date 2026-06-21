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
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden relative w-full">
      {/* Injecting localized keyframe sweep for left-to-right radiant glow shifting */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes glowSweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-glow-sweep {
          background-size: 200% 200%;
          animation: glowSweep 6s ease infinite;
        }
      `}} />

      {/* Main Chat Interface Panel */}
      <div className="flex-1 flex flex-col h-full border-r border-gray-800 min-w-0 relative">
        
        {/* Clear Logs floating trigger (since top header is removed) */}
        {messages.length > 0 && (
          <div className="absolute top-4 right-6 z-20">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearConversation} 
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 bg-gray-900/80 backdrop-blur border border-gray-800"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear Logs
            </Button>
          </div>
        )}

        {/* Conversation Stream Frame */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto pt-20 space-y-8">
              
              {/* Dark Hero Unit with 360-degree Rotating Glow Background */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-10 text-center space-y-4 shadow-xl relative overflow-hidden">
                <div className="relative inline-block">
                  {/* Slow 360-degree rotating layout element */}
                  <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-[spin_10s_linear_infinite]" style={{ transformOrigin: 'center' }} />
                  <Sparkles className="h-12 w-12 text-primary relative z-10 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-100 relative z-10">Ask Mediflow AI</h2>
              </div>

              {/* Dark Suggested Action Prompt Cards */}
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
                        ? 'bg-gray-800 text-gray-300 border border-gray-700' 
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
                            className="h-6 text-[10px] px-2 bg-gray-950 border-gray-800 text-gray-400 hover:bg-white hover:text-black transition-colors"
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

        {/* Guaranteed Sticky Prompt Input Form Box Tray */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-950/95 backdrop-blur z-30 shrink-0 shadow-xl">
          <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto relative flex items-center">
            {/* The outer container wrapper generates the sweeping primary glow ring frame */}
            <div className="w-full relative rounded-xl p-[1px] bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 animate-glow-sweep focus-within:from-primary/30 focus-within:via-primary focus-within:to-primary/30 transition-all duration-300">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything (e.g., 'How many critical referrals were rejected this week?')...."
                disabled={isLoading}
                className="w-full h-11 bg-gray-950 rounded-xl pl-4 pr-12 text-xs focus:outline-none text-gray-100 placeholder:text-gray-500"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 top-1.5 h-8 w-8 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors z-10"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Database Metadata Inspection Drawer Context Panel */}
      {inspectingData && (
        <div className="w-80 h-full bg-gray-900 border-l border-gray-800 flex flex-col animate-in slide-in-from-right duration-200 shrink-0 z-40">
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

            <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex gap-2 text-[11px] text-gray-400">
              <ShieldAlert className="h-4 w-4 shrink-0 text-primary" />
              <p>Queries are executed using read-only database connections contextually limited by transactional bounds.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}