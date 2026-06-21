'use client'

import { useState, useRef, useEffect } from 'react'
import { useAskAI } from '@/features/analytics/hooks/useAskAI'
import { Button } from '@/components/ui/button'
import { Send, Database, Terminal, ShieldAlert, Brain } from 'lucide-react'

const SUGGESTED_PROMPTS = [
  "Which facility has received the most referrals this month?",
  "List patients born after 2000 who have completed status referrals."
]

/**
 * Custom typewriter text with clean markdown stripping
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
    }, 6)

    return () => clearInterval(timer)
  }, [cleanText, isAnimated])

  return (
    <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
      {displayedText}
    </p>
  )
}

/**
 * Animated typing dots for loading state
 */
function TypingDots() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1 text-primary">
      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
      <span className="text-xs text-gray-400 ml-1">thinking{dots}</span>
    </div>
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
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden relative w-full bg-gray-950 rounded-3xl border border-gray-800 shadow-2xl mx-4 my-4">
      {/* Custom Keyframes + Colorful Floating Blobs */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glowSweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(25px, -30px) rotate(8deg); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-35px, 25px) rotate(-12deg); }
        }
        .animate-glow-sweep {
          background-size: 300% 300%;
          animation: glowSweep 8s ease infinite;
        }
        .animate-blob-1 { animation: blobFloat1 18s infinite ease-in-out; }
        .animate-blob-2 { animation: blobFloat2 22s infinite ease-in-out; }
      `}} />

      {/* Floating Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob-1" />
<div className="absolute bottom-40 right-10 w-[28rem] h-[28rem] bg-secondary/10 rounded-full blur-3xl animate-blob-2" />
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">

        {/* Conversation Area - Further adjusted for more space at bottom */}
        <div className="flex-1 overflow-y-auto p-6 pt-12 pb-28 space-y-8">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto pt-6 space-y-10">
              {/* Compact Hero */}
              <div className="relative text-center">
                <div className="mx-auto relative inline-flex items-center justify-center mb-6">
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-primary/30 shadow-2xl">
                    <Brain className="h-12 w-12 text-primary animate-[spin_25s_linear_infinite]" />
                  </div>
                </div>
               
                <h1 className="text-4xl font-semibold tracking-tighter text-white mb-2">Mediflow AI</h1>
                <p className="text-md text-gray-400 max-w-md mx-auto">
                  Ask anything about your referrals, patients, and facility data
                </p>
              </div>

              {/* Suggested Prompts */}
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[2px] text-gray-500 text-center">Try asking...</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="group text-left p-5 bg-gray-900/70 hover:bg-gray-800/80 border border-gray-800 hover:border-primary/50 rounded-2xl transition-all duration-300 hover:shadow-xl text-sm text-gray-300 hover:text-white"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg, index) => {
                const isLatest = index === messages.length - 1 && msg.role === 'assistant'
                return (
                  <div
                    key={msg.id}
                    className={`group flex gap-5 transition-all duration-300 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'assistant' && (
                      <button 
                        onClick={clearConversation}
className="h-8 w-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1 hover:bg-primary/20 transition-colors cursor-pointer"
                        title="Clear conversation"
                      >
                        <Brain className="h-4 w-4 text-primary" />
                      </button>
                    )}
                   
                    <div className={`max-w-[85%] rounded-3xl px-6 py-4 transition-all duration-300 ${
                      msg.role === 'user'

                        ? 'bg-primary/80 text-primary-foreground rounded-br-none shadow-md' 
                        : 'bg-gray-900/90 border border-gray-800/80 backdrop-blur-xl rounded-bl-none'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      ) : (
                        <TypewriterText text={msg.content} isAnimated={isLatest} />
                      )}

                      {msg.role === 'assistant' && msg.metadata?.generatedSql && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4 h-7 text-[10px] px-3 bg-gray-950/70 hover:bg-gray-800 border border-gray-700 text-gray-400 hover:text-white"
                          onClick={() => setInspectingData({
                            sql: msg.metadata?.generatedSql,
                            raw: msg.metadata?.rawData
                          })}
                        >
                          <Terminal className="h-3 w-3 mr-1.5" />
                          Inspect Query
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex gap-5">
<div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-gray-900/90 border border-gray-800/80 backdrop-blur-xl rounded-3xl px-6 py-4 rounded-bl-none">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>
          )}
        </div>

        {/* Sticky Input - Adjusted positioning */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent z-30">
          <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto">
            <div className="relative w-full">
<div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl animate-glow-sweep" />
             
              <div className="relative bg-gray-950 border border-gray-700 rounded-3xl focus-within:border-primary/60 transition-all overflow-hidden">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Mediflow AI anything about your data..."
                  disabled={isLoading}
                  className="w-full h-14 bg-transparent pl-6 pr-16 text-sm placeholder:text-gray-500 focus:outline-none text-gray-100 rounded-3xl"
                />
               
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* SQL Drawer */}
      {inspectingData && (
        <div className="w-96 h-full bg-gray-950 border-l border-gray-800 flex flex-col z-50 animate-in slide-in-from-right-2 duration-300">
          <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/70 backdrop-blur">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold text-sm">Query Inspection</div>
                <div className="text-[10px] text-gray-500">Read-only execution log</div>
              </div>
            </div>
            <button
              onClick={() => setInspectingData(null)}
              className="text-gray-400 hover:text-white text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6 space-y-8 text-sm">
            <div>
              <div className="uppercase text-xs tracking-widest text-gray-500 mb-3">Generated SQL</div>
              <div className="p-5 bg-black/60 border border-gray-800 rounded-2xl font-mono text-xs text-emerald-400 overflow-auto max-h-80">
                {inspectingData.sql}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="uppercase text-xs tracking-widest text-gray-500">Result Rows</div>
                <div className="text-xs text-gray-400">({inspectingData.raw?.length || 0} rows)</div>
              </div>
              <div className="bg-black/60 border border-gray-800 rounded-2xl p-5 font-mono text-xs text-blue-300 overflow-auto max-h-[420px]">
                <pre>{JSON.stringify(inspectingData.raw, null, 2)}</pre>
              </div>
            </div>

            <div className="bg-amber-950/50 border border-amber-900/50 rounded-2xl p-4 text-xs text-amber-400 flex gap-3">
              <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
              All queries run in a read-only sandbox with strict row limits.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}