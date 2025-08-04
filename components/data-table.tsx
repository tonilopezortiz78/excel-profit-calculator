"use client"

import { useState, useMemo } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TableRow as TableRowType } from '@/types'
import { ArrowUpDown, ArrowUp, ArrowDown, Filter, X, Search } from 'lucide-react'

interface DataTableProps {
  data: TableRowType[]
  headers: string[]
  fileName: string
  selectedRows: number[]
  onRowSelectionChange: (selectedRows: number[]) => void
}

export function DataTable({ data, headers, fileName, selectedRows, onRowSelectionChange }: DataTableProps) {
  const [sortBy, setSortBy] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterPair, setFilterPair] = useState<string>('')
  const [filterSide, setFilterSide] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
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

  // Get unique values for filter dropdowns
  const uniquePairs = useMemo(() => {
    const pairs = data.map(row => String(row.Pairs || '')).filter(Boolean)
    return [...new Set(pairs)].sort()
  }, [data])

  const uniqueSides = useMemo(() => {
    const sides = data.map(row => String(row.Side || '')).filter(Boolean)
    return [...new Set(sides)].sort()
  }, [data])

  // Filter and sort the data while maintaining original indices for selection
  const filteredAndSortedDataWithIndices = useMemo(() => {
    let dataWithIndices = data.map((row, originalIndex) => ({ row, originalIndex }))
    
    // Apply filters
    if (filterPair) {
      dataWithIndices = dataWithIndices.filter(item => 
        String(item.row.Pairs || '').toLowerCase().includes(filterPair.toLowerCase())
      )
    }
    
    if (filterSide) {
      dataWithIndices = dataWithIndices.filter(item => 
        String(item.row.Side || '').toLowerCase() === filterSide.toLowerCase()
      )
    }
    
    if (searchText) {
      dataWithIndices = dataWithIndices.filter(item => 
        Object.values(item.row).some(value => 
          String(value || '').toLowerCase().includes(searchText.toLowerCase())
        )
      )
    }
    
    // Apply sorting
    if (!sortBy) return dataWithIndices

    return dataWithIndices.sort((a, b) => {
      let aValue = a.row[sortBy]
      let bValue = b.row[sortBy]

      // Handle different data types
      if (sortBy.toLowerCase().includes('price') || sortBy.toLowerCase().includes('amount') || sortBy.toLowerCase().includes('total') || sortBy.toLowerCase().includes('fee')) {
        aValue = parseFloat(String(aValue || 0))
        bValue = parseFloat(String(bValue || 0))
      } else if (sortBy.toLowerCase().includes('time')) {
        aValue = new Date(String(aValue || '')).getTime()
        bValue = new Date(String(bValue || '')).getTime()
      } else {
        aValue = String(aValue || '').toLowerCase()
        bValue = String(bValue || '').toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortBy, sortDirection, filterPair, filterSide, searchText])

  const filteredData = filteredAndSortedDataWithIndices.map(item => item.row)
  const originalIndices = filteredAndSortedDataWithIndices.map(item => item.originalIndex)

  const allSelected = selectedRows.length === data.length && data.length > 0
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="h-3 w-3 opacity-50" />
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 text-primary" />
      : <ArrowDown className="h-3 w-3 text-primary" />
  }

  const clearAllFilters = () => {
    setFilterPair('')
    setFilterSide('')
    setSearchText('')
  }

  const hasActiveFilters = filterPair || filterSide || searchText

  return (
    <Card>
      <CardHeader className="pb-3 space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Trading Data</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{fileName}</Badge>
            <Badge variant="outline">{filteredData.length} of {data.length} rows</Badge>
          </div>
        </div>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-48"
            />
          </div>
          
          {/* Currency Pair Filter */}
          {uniquePairs.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Pair:</span>
              <Select value={filterPair} onValueChange={setFilterPair}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All pairs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All pairs</SelectItem>
                  {uniquePairs.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Side Filter */}
          {uniqueSides.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Side:</span>
              <Select value={filterSide} onValueChange={setFilterSide}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  {uniqueSides.map((side) => (
                    <SelectItem key={side} value={side}>
                      {side}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <Select value={sortBy} onValueChange={(value) => handleSort(value)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Default order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default order</SelectItem>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllFilters}
              className="flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear filters
            </Button>
          )}
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
                      className="px-2 py-2 text-xs font-semibold border-r border-muted/20 bg-muted/30 sticky top-0 z-10 cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => handleSort(header)}
                    >
                      <div className="flex items-center gap-1">
                        {header}
                        {getSortIcon(header)}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={headers.length + 1} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Filter className="h-8 w-8 opacity-50" />
                        <p>No data matches your filters</p>
                        {hasActiveFilters && (
                          <Button variant="outline" size="sm" onClick={clearAllFilters}>
                            Clear all filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, filteredIndex) => {
                    const originalIndex = originalIndices[filteredIndex]
                    return (
                      <TableRow 
                        key={originalIndex}
                        className={`hover:bg-muted/20 transition-colors ${
                          selectedRows.includes(originalIndex) ? 'bg-primary/5 border-primary/20' : ''
                        }`}
                      >
                        <TableCell className="w-12 px-2 py-1 border-r border-muted/20">
                          <Checkbox
                            checked={selectedRows.includes(originalIndex)}
                            onCheckedChange={(checked) => handleRowSelect(originalIndex, !!checked)}
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
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}