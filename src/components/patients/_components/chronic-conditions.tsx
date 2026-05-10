'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Edit, Trash2, Plus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ChronicConditionsProps {
  chronicConditions: string[]
  onChronicConditionsChange?: (chronicConditions: string[]) => void
}

export function ChronicConditions({ chronicConditions, onChronicConditionsChange }: ChronicConditionsProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newValue, setNewValue] = useState('')

  const handleEditCondition = (index: number) => {
    setEditIndex(index)
    setEditValue(chronicConditions[index])
  }

  const handleSaveEdit = () => {
    if (editIndex !== null && editValue.trim()) {
      const newChronicConditions = [...chronicConditions]
      newChronicConditions[editIndex] = editValue.trim()
      onChronicConditionsChange?.(newChronicConditions)
      setEditIndex(null)
      setEditValue('')
    }
  }

  const handleDeleteCondition = (index: number) => {
    const newChronicConditions = chronicConditions.filter((_, i) => i !== index)
    onChronicConditionsChange?.(newChronicConditions)
  }

  const handleCancelEdit = () => {
    setEditIndex(null)
    setEditValue('')
  }

  const handleAddCondition = () => {
    setIsAdding(true)
    setNewValue('')
  }

  const handleSaveNew = () => {
    if (newValue.trim()) {
      const newChronicConditions = [...chronicConditions, newValue.trim()]
      onChronicConditionsChange?.(newChronicConditions)
      setIsAdding(false)
      setNewValue('')
    }
  }

  const handleCancelNew = () => {
    setIsAdding(false)
    setNewValue('')
  }

  const handleKeyDownNew = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveNew()
    } else if (e.key === 'Escape') {
      handleCancelNew()
    }
  }

  const handleKeyDownEdit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }
  return (
    <TooltipProvider>
      <Card className="bg-gray-900/60 backdrop-blur-md border border-border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            Chronic Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* ADD NEW CHRONIC CONDITION */}
            {isAdding && (
              <div className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={handleKeyDownNew}
                  placeholder="Enter new chronic condition"
                  className="flex-1 px-2 py-1 text-sm bg-transparent border border-purple-400 rounded text-purple-400 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleSaveNew}
                  className="text-white hover:text-gray-200 p-1 h-6 w-6"
                >
                  ✓
                </Button>
                <Button
                  size="sm"
                  onClick={handleCancelNew}
                  className="text-white hover:text-gray-200 p-1 h-6 w-6"
                >
                  ✕
                </Button>
              </div>
            )}
            
            {/* EXISTING CHRONIC CONDITIONS */}
            {chronicConditions.length > 0 ? (
              chronicConditions.map((condition, index) => (
                <div key={index} className="group flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors">
                  {editIndex === index ? (
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDownEdit}
                        className="flex-1 px-2 py-1 text-sm bg-transparent border border-purple-400 rounded text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="text-white hover:text-gray-200 p-1 h-6 w-6"
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCancelEdit}
                        className="text-white hover:text-gray-200 p-1 h-6 w-6"
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-purple-400">{condition}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-purple-400 hover:text-purple-300 hover:bg-transparent p-1 h-6 w-6"
                              onClick={() => handleEditCondition(index)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit chronic condition</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-purple-400 hover:text-purple-300 hover:bg-transparent p-1 h-6 w-6"
                              onClick={() => handleDeleteCondition(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete chronic condition</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No chronic conditions recorded</p>
              </div>
            )}
            
            {/* ADD BUTTON */}
            {!isAdding && (
              <div className="flex justify-center pt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-2 h-8 w-8 rounded-full"
                      onClick={handleAddCondition}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add chronic condition</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
