"use client"

import { useState } from 'react'
import { ExcelUpload } from '@/components/excel-upload'
import { DataTable } from '@/components/data-table'
import { ThemeToggle } from '@/components/theme-toggle'
import { ProfitCalculator } from '@/components/profit-calculator'
import { TableRow } from '@/types'

export default function Home() {
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const handleDataLoad = (data: TableRow[], headers: string[], fileName: string) => {
    setTableData(data)
    setHeaders(headers)
    setFileName(fileName)
  }

  const clearData = () => {
    setTableData([])
    setHeaders([])
    setFileName('')
    setSelectedRows([])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Excel Profit Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Upload your trading data and calculate potential profits with real-time analysis
            </p>
          </div>
          <div className="flex items-center gap-4">
            {tableData.length > 0 && (
              <button
                onClick={clearData}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear Data
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {tableData.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <ExcelUpload onDataLoad={handleDataLoad} />
            <div className="mt-8 text-center">
              <h2 className="text-lg font-semibold mb-2">Supported Features</h2>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>💰 Real-time profit calculations</li>
                <li>📊 Input target sell price for analysis</li>
                <li>📈 Percentage and USDT profit display</li>
                <li>🎯 Break-even price analysis</li>
                <li>✅ Excel/CSV file support</li>
                <li>🌙 Dark/Light theme support</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ProfitCalculator 
              data={tableData} 
              selectedRows={selectedRows} 
            />
            <DataTable 
              data={tableData} 
              headers={headers} 
              fileName={fileName}
              selectedRows={selectedRows}
              onRowSelectionChange={setSelectedRows}
            />
          </div>
        )}
      </main>
    </div>
  );
}
