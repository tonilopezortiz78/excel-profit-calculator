"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileSpreadsheet } from 'lucide-react'
import { TableRow } from '@/types'

interface ExcelUploadProps {
  onDataLoad: (data: TableRow[], headers: string[], fileName: string) => void
}

export function ExcelUpload({ onDataLoad }: ExcelUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setIsProcessing(true)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      
      // Get the first worksheet
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]
      
      // Convert to JSON with header row
      const jsonData: (string | number)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      if (jsonData.length > 0) {
        const headers = jsonData[0] as string[]
        const data: TableRow[] = jsonData.slice(1).map((row: (string | number)[]) => {
          const rowObj: TableRow = {}
          headers.forEach((header, index) => {
            rowObj[header] = row[index] || ''
          })
          return rowObj
        })
        
        onDataLoad(data, headers, file.name)
      }
    } catch (error) {
      console.error('Error processing Excel file:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [onDataLoad])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  })

  return (
    <Card className="p-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
          )}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isProcessing ? 'Processing...' : 'Drop your Excel file here'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supports .xlsx, .xls, and .csv files
            </p>
            <Button variant="outline" disabled={isProcessing}>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}