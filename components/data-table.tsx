"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { TableRow as TableRowType } from '@/types'

interface DataTableProps {
  data: TableRowType[]
  headers: string[]
  fileName: string
  selectedRows: number[]
  onRowSelectionChange: (selectedRows: number[]) => void
}

export function DataTable({ data, headers, fileName, selectedRows, onRowSelectionChange }: DataTableProps) {
  const formatCellValue = (value: string | number | null | undefined, header: string) => {
    if (value === null || value === undefined || value === '') return '-'
    
    // Format numeric values based on column type
    if (typeof value === 'number') {
      // Price columns
      if (header.toLowerCase().includes('price') || header.toLowerCase().includes('filled')) {
        return value.toLocaleString(undefined, { 
          minimumFractionDigits: 1, 
          maximumFractionDigits: 4 
        })
      }
      // Amount/Total columns
      if (header.toLowerCase().includes('amount') || header.toLowerCase().includes('total')) {
        return value.toLocaleString(undefined, { 
          minimumFractionDigits: 0, 
          maximumFractionDigits: 6 
        })
      }
      // Fee columns
      if (header.toLowerCase().includes('fee')) {
        return value.toString()
      }
      return value.toLocaleString()
    }
    
    return value.toString()
  }

  const getCellClassName = (value: string | number | null | undefined, header: string) => {
    let baseClasses = "px-2 py-1 text-sm border-r border-muted/20"
    
    // Add alignment based on content type
    if (typeof value === 'number') {
      baseClasses += " text-right tabular-nums"
    }
    
    // Color coding for Buy/Sell
    if (header.toLowerCase().includes('side')) {
      if (value === 'Buy') {
        baseClasses += " text-green-600 dark:text-green-400 font-medium"
      } else if (value === 'Sell') {
        baseClasses += " text-red-600 dark:text-red-400 font-medium"
      }
    }
    
    // Highlight currency pairs
    if (header.toLowerCase().includes('pairs')) {
      baseClasses += " font-mono font-medium"
    }
    
    return baseClasses
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onRowSelectionChange(data.map((_, index) => index))
    } else {
      onRowSelectionChange([])
    }
  }

  const handleRowSelect = (rowIndex: number, checked: boolean) => {
    if (checked) {
      onRowSelectionChange([...selectedRows, rowIndex])
    } else {
      onRowSelectionChange(selectedRows.filter(index => index !== rowIndex))
    }
  }

  const allSelected = selectedRows.length === data.length && data.length > 0
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Trading Data</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{fileName}</Badge>
            <Badge variant="outline">{data.length} rows</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-auto max-h-[70vh]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12 px-2 py-2 border-r border-muted/20 bg-muted/30 sticky top-0 z-10">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = someSelected && !allSelected
                        }
                      }}
                    />
                  </TableHead>
                  {headers.map((header, index) => (
                    <TableHead 
                      key={index} 
                      className="px-2 py-2 text-xs font-semibold border-r border-muted/20 bg-muted/30 sticky top-0 z-10"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow 
                    key={rowIndex}
                    className={`hover:bg-muted/20 transition-colors ${
                      selectedRows.includes(rowIndex) ? 'bg-primary/5 border-primary/20' : ''
                    }`}
                  >
                    <TableCell className="w-12 px-2 py-1 border-r border-muted/20">
                      <Checkbox
                        checked={selectedRows.includes(rowIndex)}
                        onCheckedChange={(checked) => handleRowSelect(rowIndex, !!checked)}
                      />
                    </TableCell>
                    {headers.map((header, cellIndex) => (
                      <TableCell 
                        key={cellIndex}
                        className={getCellClassName(row[header], header)}
                      >
                        {formatCellValue(row[header], header)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}