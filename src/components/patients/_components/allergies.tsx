'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Edit, Trash2, Plus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AllergiesProps {
  allergies: string[]
  onAllergiesChange?: (allergies: string[]) => void
}

export function Allergies({ allergies, onAllergiesChange }: AllergiesProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newValue, setNewValue] = useState('')

  const handleEditAllergy = (index: number) => {
    setEditIndex(index)
    setEditValue(allergies[index])
  }

  const handleSaveEdit = () => {
    if (editIndex !== null && editValue.trim()) {
      const newAllergies = [...allergies]
      newAllergies[editIndex] = editValue.trim()
      onAllergiesChange?.(newAllergies)
      setEditIndex(null)
      setEditValue('')
    }
  }

  const handleDeleteAllergy = (index: number) => {
    const newAllergies = allergies.filter((_, i) => i !== index)
    onAllergiesChange?.(newAllergies)
  }

  const handleCancelEdit = () => {
    setEditIndex(null)
    setEditValue('')
  }

  const handleAddAllergy = () => {
    setIsAdding(true)
    setNewValue('')
  }

  const handleSaveNew = () => {
    if (newValue.trim()) {
      const newAllergies = [...allergies, newValue.trim()]
      onAllergiesChange?.(newAllergies)
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

  if (!allergies || allergies.length === 0) {
    return (
      <TooltipProvider>
        <Card className="bg-gray-900/60 backdrop-blur-md border border-border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Allergies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No known allergies</p>
          </CardContent>
        </Card>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Card className="bg-gray-900/60 backdrop-blur-md border border-border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Allergies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* ADD NEW ALLERGY */}
          {isAdding && (
            <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={handleKeyDownNew}
                placeholder="Enter new allergy"
                className="flex-1 px-2 py-1 text-sm bg-transparent border border-red-400 rounded text-red-400 placeholder-red-400/50 focus:outline-none focus:ring-2 focus:ring-red-400"
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
          
          {/* EXISTING ALLERGIES */}
          {allergies.map((allergy, index) => (
            <div key={index} className="group flex items-center justify-between p-2 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">
              {editIndex === index ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDownEdit}
                    className="flex-1 px-2 py-1 text-sm bg-transparent border border-red-400 rounded text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
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
                  <span className="text-sm text-red-400">{allergy}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-transparent p-1 h-6 w-6"
                          onClick={() => handleEditAllergy(index)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit allergy</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-transparent p-1 h-6 w-6"
                          onClick={() => handleDeleteAllergy(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete allergy</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {/* ADD BUTTON */}
          {!isAdding && (
            <div className="flex justify-center pt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 h-8 w-8 rounded-full"
                    onClick={handleAddAllergy}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add allergy</p>
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
