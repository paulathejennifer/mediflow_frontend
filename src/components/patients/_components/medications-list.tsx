'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pill, Edit, Trash2, Plus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface MedicationsListProps {
  medications: string[]
  onMedicationsChange?: (medications: string[]) => void
}

export function MedicationsList({ medications, onMedicationsChange }: MedicationsListProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newValue, setNewValue] = useState('')

  const handleEditMedication = (index: number) => {
    setEditIndex(index)
    setEditValue(medications[index])
  }

  const handleSaveEdit = () => {
    if (editIndex !== null && editValue.trim()) {
      const newMedications = [...medications]
      newMedications[editIndex] = editValue.trim()
      onMedicationsChange?.(newMedications)
      setEditIndex(null)
      setEditValue('')
    }
  }

  const handleDeleteMedication = (index: number) => {
    const newMedications = medications.filter((_, i) => i !== index)
    onMedicationsChange?.(newMedications)
  }

  const handleCancelEdit = () => {
    setEditIndex(null)
    setEditValue('')
  }

  const handleAddMedication = () => {
    setIsAdding(true)
    setNewValue('')
  }

  const handleSaveNew = () => {
    if (newValue.trim()) {
      const newMedications = [...medications, newValue.trim()]
      onMedicationsChange?.(newMedications)
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
            <Pill className="h-5 w-5 mr-2 text-blue-500" />
            Current Medications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* ADD NEW MEDICATION */}
            {isAdding && (
              <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyDown={handleKeyDownNew}
                  placeholder="Enter new medication"
                  className="flex-1 px-2 py-1 text-sm bg-transparent border border-blue-400 rounded text-blue-400 placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            
            {/* EXISTING MEDICATIONS */}
            {medications.length > 0 ? (
              medications.map((medication, index) => (
              <div key={index} className="group flex items-center justify-between p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
                {editIndex === index ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDownEdit}
                      className="flex-1 px-2 py-1 text-sm bg-transparent border border-blue-400 rounded text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    <span className="text-sm text-blue-400">{medication}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-transparent p-1 h-6 w-6"
                            onClick={() => handleEditMedication(index)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit medication</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-transparent p-1 h-6 w-6"
                            onClick={() => handleDeleteMedication(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete medication</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Pill className="h-12 w-12 text-gray-500 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No current medications</p>
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
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 h-8 w-8 rounded-full"
                    onClick={handleAddMedication}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add medication</p>
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
