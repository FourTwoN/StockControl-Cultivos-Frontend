import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileIcon } from 'lucide-react'

interface FileUploadProps {
  readonly accept?: string
  readonly maxSize?: number
  readonly onUpload: (files: File[]) => void
  readonly multiple?: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({ accept, maxSize, onUpload, multiple = false }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<readonly File[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFiles = useCallback(
    (files: File[]): { valid: File[]; error: string | null } => {
      const validFiles: File[] = []
      for (const file of files) {
        if (maxSize && file.size > maxSize) {
          return {
            valid: [],
            error: `File "${file.name}" exceeds maximum size of ${formatFileSize(maxSize)}`,
          }
        }
        if (accept) {
          const acceptedTypes = accept.split(',').map((t) => t.trim())
          const matchesType = acceptedTypes.some((type) => {
            if (type.startsWith('.')) {
              return file.name.toLowerCase().endsWith(type.toLowerCase())
            }
            if (type.endsWith('/*')) {
              return file.type.startsWith(type.replace('/*', '/'))
            }
            return file.type === type
          })
          if (!matchesType) {
            return {
              valid: [],
              error: `File "${file.name}" is not an accepted file type`,
            }
          }
        }
        validFiles.push(file)
      }
      return { valid: validFiles, error: null }
    },
    [accept, maxSize],
  )

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const files = Array.from(fileList)
      const { valid, error: validationError } = validateFiles(files)

      if (validationError) {
        setError(validationError)
        return
      }

      setError(null)
      setSelectedFiles(valid)
      onUpload(valid)
    },
    [validateFiles, onUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const removeFile = useCallback(
    (index: number) => {
      const updated = selectedFiles.filter((_, i) => i !== index)
      setSelectedFiles(updated)
      onUpload([...updated])
    },
    [selectedFiles, onUpload],
  )

  return (
    <div className="flex flex-col gap-2">
      {/* Drop zone */}
      <div
        className={[
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-background',
        ].join(' ')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openFilePicker()
        }}
        role="button"
        tabIndex={0}
      >
        <Upload className="mb-2 h-8 w-8 text-muted" />
        <p className="text-sm font-medium text-primary">Drop files here or click to browse</p>
        <p className="mt-1 text-xs text-muted">
          {accept ? `Accepted: ${accept}` : 'Any file type'}
          {maxSize ? ` | Max: ${formatFileSize(maxSize)}` : ''}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        aria-label="File upload"
      />

      {/* Error */}
      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* File list */}
      {selectedFiles.length > 0 && (
        <ul className="flex flex-col gap-1">
          {selectedFiles.map((file, index) => (
            <li
              key={`${file.name}-${file.size}`}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
            >
              <FileIcon className="h-4 w-4 flex-shrink-0 text-muted" />
              <span className="flex-1 truncate text-sm text-primary">{file.name}</span>
              <span className="text-xs text-muted">{formatFileSize(file.size)}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="rounded p-0.5 text-muted transition-colors hover:text-destructive"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
