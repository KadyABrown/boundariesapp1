import { useState, KeyboardEvent } from 'react'
import { Input } from './input'
import { Button } from './button'
import { Badge } from './badge'
import { X, Plus } from 'lucide-react'
import { Label } from './label'

interface TagInputProps {
  label: string
  placeholder?: string
  value: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
  disabled?: boolean
}

export function TagInput({ 
  label, 
  placeholder = "Type and press Enter to add", 
  value = [], 
  onChange, 
  maxTags = 10,
  disabled = false 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const addTag = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !value.includes(trimmedValue) && value.length < maxTags) {
      onChange([...value, trimmedValue])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">{label}</Label>
      
      {/* Tags Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 min-h-[60px]">
          {value.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
              <span className="text-sm">{tag}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-red-100"
                onClick={() => removeTag(tag)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length >= maxTags ? `Maximum ${maxTags} items` : placeholder}
          disabled={disabled || value.length >= maxTags}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addTag}
          disabled={disabled || !inputValue.trim() || value.includes(inputValue.trim()) || value.length >= maxTags}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        {value.length > 0 ? `${value.length}/${maxTags} items added` : "Type and press Enter or click + to add items"}
      </p>
    </div>
  )
}