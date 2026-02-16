import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Cpu, Upload, CheckCircle, XCircle, Loader2, RefreshCw, Layers, Target } from 'lucide-react'
import { Button } from '@core/components/ui/Button'
import { Card } from '@core/components/ui/Card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@core/components/ui/Select'
import { FileUpload } from '@core/components/forms/FileUpload'
import { Badge } from '@core/components/ui/Badge'
import { useToast } from '@core/components/ui/Toast'
import { useMLProcess, useMLPipelines, useMLHealth, fileToBase64 } from '../hooks/useMLProcess'

interface Detection {
  label: string
  confidence: number
  boundingBox: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
}

interface ProcessingResult {
  success: boolean
  sessionId: string
  imageId: string
  pipeline: string
  durationMs: number
  segmentsFound: number
  detectionsFound: number
  detections: Detection[]
}

export function MLAnalysisPage() {
  const toast = useToast()
  const navigate = useNavigate()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedPipeline, setSelectedPipeline] = useState('SEGMENT_DETECT')
  const [result, setResult] = useState<ProcessingResult | null>(null)

  const { data: health, isLoading: healthLoading } = useMLHealth()
  const { data: pipelines, isLoading: pipelinesLoading } = useMLPipelines()
  const processImage = useMLProcess()

  const handleFileUpload = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      setResult(null)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    }
  }, [])

  const handleProcess = useCallback(async () => {
    if (!selectedFile) return

    try {
      const base64 = await fileToBase64(selectedFile)

      const response = await processImage.mutateAsync({
        filename: selectedFile.name,
        contentType: selectedFile.type,
        imageBase64: base64,
        pipeline: selectedPipeline,
      })

      if (response.success) {
        toast.success(`Processed in ${response.durationMs}ms - Found ${response.detectionsFound} detections`)

        // Store result for display
        // Note: The backend returns detections in sessionStatus, we need to fetch them
        // For now, we'll show the summary
        setResult({
          success: true,
          sessionId: response.sessionId,
          imageId: response.imageId,
          pipeline: response.pipeline,
          durationMs: response.durationMs,
          segmentsFound: response.segmentsFound,
          detectionsFound: response.detectionsFound,
          detections: [], // TODO: Fetch detections from API
        })
      } else {
        toast.error(`Processing failed: ${response.error}`)
        setResult({
          success: false,
          sessionId: response.sessionId,
          imageId: response.imageId,
          pipeline: response.pipeline,
          durationMs: response.durationMs,
          segmentsFound: 0,
          detectionsFound: 0,
          detections: [],
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to process image: ${message}`)
    }
  }, [selectedFile, selectedPipeline, processImage, toast])

  const handleReset = useCallback(() => {
    setSelectedFile(null)
    setImagePreview(null)
    setResult(null)
  }, [])

  const pipelineOptions = pipelines
    ? Object.entries(pipelines.pipelines).map(([name, info]) => ({
        value: name,
        label: `${name} (${info.steps.join(' → ')})`,
      }))
    : [{ value: 'SEGMENT_DETECT', label: 'SEGMENT_DETECT (Loading...)' }]

  const mlWorkerAvailable = health?.mlWorkerAvailable ?? false

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">ML Analysis</h1>
        <p className="mt-1 text-sm text-muted">
          Upload an image to run ML detection and segmentation
        </p>
      </div>

      {/* Status Bar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">ML Worker:</span>
          {healthLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted" />
          ) : mlWorkerAvailable ? (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Connected
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Not Available
            </Badge>
          )}
        </div>

        {pipelines && (
          <div className="text-sm text-muted">
            Industry: <span className="font-medium text-primary">{pipelines.industry}</span> v{pipelines.version}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Panel */}
        <Card className="p-4">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
            <Upload className="h-5 w-5" />
            Upload Image
          </h2>

          {!selectedFile ? (
            <FileUpload
              accept="image/jpeg,image/png,image/webp"
              maxSize={50 * 1024 * 1024} // 50MB
              onUpload={handleFileUpload}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="overflow-hidden rounded-lg border border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-auto max-h-96 w-full object-contain"
                  />
                </div>
              )}

              {/* File Info */}
              <div className="flex items-center justify-between rounded-lg bg-surface p-3">
                <div>
                  <p className="font-medium text-primary">{selectedFile.name}</p>
                  <p className="text-xs text-muted">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="mr-1 h-4 w-4" />
                  Change
                </Button>
              </div>

              {/* Pipeline Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Pipeline</label>
                <Select
                  value={selectedPipeline}
                  onValueChange={setSelectedPipeline}
                  disabled={pipelinesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelineOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Process Button */}
              <Button
                onClick={handleProcess}
                disabled={!mlWorkerAvailable || processImage.isPending}
                className="w-full"
              >
                {processImage.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Cpu className="mr-2 h-4 w-4" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Results Panel */}
        <Card className="p-4">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-primary">
            <Target className="h-5 w-5" />
            Results
          </h2>

          {!result && !processImage.isPending && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Cpu className="mb-4 h-12 w-12 text-muted/50" />
              <p className="text-muted">Upload an image and run analysis to see results</p>
            </div>
          )}

          {processImage.isPending && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
              <p className="font-medium text-primary">Processing image...</p>
              <p className="text-sm text-muted">This may take a few seconds</p>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                {result.success ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Success
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Failed
                  </Badge>
                )}
                <span className="text-sm text-muted">
                  Processed in {result.durationMs}ms
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Layers className="h-5 w-5 text-blue-500" />
                    <span className="text-2xl font-bold text-primary">{result.segmentsFound}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">Segments</p>
                </div>

                <div className="rounded-lg bg-surface p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold text-primary">{result.detectionsFound}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">Detections</p>
                </div>
              </div>

              {/* Details */}
              <div className="rounded-lg bg-surface p-4">
                <h3 className="mb-2 text-sm font-medium text-primary">Details</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <dt className="text-muted">Session ID:</dt>
                  <dd className="font-mono text-primary">{result.sessionId.slice(0, 8)}...</dd>

                  <dt className="text-muted">Image ID:</dt>
                  <dd className="font-mono text-primary">{result.imageId.slice(0, 8)}...</dd>

                  <dt className="text-muted">Pipeline:</dt>
                  <dd className="text-primary">{result.pipeline}</dd>
                </dl>
              </div>

              {/* View Session Link */}
              <Button
                variant="outline"
                onClick={() => navigate(`/fotos/${result.sessionId}`)}
              >
                View Full Session Details
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
