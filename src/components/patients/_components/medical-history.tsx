'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, Edit, Trash2, Plus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface MedicalHistoryProps {
  medicalHistory: string[]
  onMedicalHistoryChange?: (medicalHistory: string[]) => void
}

export function MedicalHistory({ medicalHistory, onMedicalHistoryChange }: MedicalHistoryProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newValue, setNewValue] = useState('')

  const handleEditHistory = (index: number) => {
    setEditIndex(index)
    setEditValue(medicalHistory[index])
  }

  const handleSaveEdit = () => {
    if (editIndex !== null && editValue.trim()) {
      const newMedicalHistory = [...medicalHistory]
      newMedicalHistory[editIndex] = editValue.trim()
      onMedicalHistoryChange?.(newMedicalHistory)
      setEditIndex(null)
      setEditValue('')
    }
  }

  const handleDeleteHistory = (index: number) => {
    const newMedicalHistory = medicalHistory.filter((_, i) => i !== index)
    onMedicalHistoryChange?.(newMedicalHistory)
  }

  const handleCancelEdit = () => {
    setEditIndex(null)
    setEditValue('')
  }

  const handleAddHistory = () => {
    setIsAdding(true)
    setNewValue('')
  }

  const handleSaveNew = () => {
    if (newValue.trim()) {
      const newMedicalHistory = [...medicalHistory, newValue.trim()]
      onMedicalHistoryChange?.(newMedicalHistory)
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
            <Activity className="h-5 w-5 mr-2 text-orange-500" />
            Medical History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* ADD NEW MEDICAL HISTORY */}
            {isAdding && (
              <div className="flex items-center gap-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={handleKeyDownNew}
                  placeholder="Enter new medical history (e.g., 2024: Diagnosis)"
                  className="flex-1 px-2 py-1 text-sm bg-transparent border border-orange-400 rounded text-orange-400 placeholder-orange-400/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
            
            {/* EXISTING MEDICAL HISTORY */}
            {medicalHistory.length > 0 ? (
              medicalHistory.map((item, index) => {
                const [year, ...condition] = item.split(': ')
                return (
                  <div key={index} className="group flex items-center justify-between p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors">
                    {editIndex === index ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDownEdit}
                          className="flex-1 px-2 py-1 text-sm bg-transparent border border-orange-400 rounded text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                        <span className="text-sm text-orange-400">{year}: {condition}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-orange-400 hover:text-orange-300 hover:bg-transparent p-1 h-6 w-6"
                                onClick={() => handleEditHistory(index)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit medical history</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-orange-400 hover:text-orange-300 hover:bg-transparent p-1 h-6 w-6"
                                onClick={() => handleDeleteHistory(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete medical history</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No medical history available</p>
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
                      className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 p-2 h-8 w-8 rounded-full"
                      onClick={handleAddHistory}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add medical history</p>
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
