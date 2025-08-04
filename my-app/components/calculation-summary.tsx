"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TableRow } from '@/types'

interface CalculationSummaryProps {
  data: TableRow[]
  selectedRows: number[]
}

export function CalculationSummary({ data, selectedRows }: CalculationSummaryProps) {
  if (selectedRows.length === 0) {
    return null
  }

  const selectedData = selectedRows.map(index => data[index])

  // Calculate weighted average price and total quantity
  const calculations = selectedData.reduce((acc, row) => {
    const price = parseFloat(String(row['Filled Price'] || 0))
    const quantity = parseFloat(String(row['Executed Amount'] || 0))
    const total = parseFloat(String(row['Total'] || 0))

    if (!isNaN(price) && !isNaN(quantity)) {
      acc.totalValue += total || (price * quantity)
      acc.totalQuantity += quantity
      acc.count += 1
    }

    return acc
  }, { totalValue: 0, totalQuantity: 0, count: 0 })

  const averagePrice = calculations.totalQuantity > 0 
    ? calculations.totalValue / calculations.totalQuantity 
    : 0

  // Separate Buy and Sell calculations
  const buyData = selectedData.filter(row => row.Side === 'Buy')
  const sellData = selectedData.filter(row => row.Side === 'Sell')

  const buyCalc = buyData.reduce((acc, row) => {
    const price = parseFloat(String(row['Filled Price'] || 0))
    const quantity = parseFloat(String(row['Executed Amount'] || 0))
    const total = parseFloat(String(row['Total'] || 0))

    if (!isNaN(price) && !isNaN(quantity)) {
      acc.totalValue += total || (price * quantity)
      acc.totalQuantity += quantity
    }
    return acc
  }, { totalValue: 0, totalQuantity: 0 })

  const sellCalc = sellData.reduce((acc, row) => {
    const price = parseFloat(String(row['Filled Price'] || 0))
    const quantity = parseFloat(String(row['Executed Amount'] || 0))
    const total = parseFloat(String(row['Total'] || 0))

    if (!isNaN(price) && !isNaN(quantity)) {
      acc.totalValue += total || (price * quantity)
      acc.totalQuantity += quantity
    }
    return acc
  }, { totalValue: 0, totalQuantity: 0 })

  const avgBuyPrice = buyCalc.totalQuantity > 0 ? buyCalc.totalValue / buyCalc.totalQuantity : 0
  const avgSellPrice = sellCalc.totalQuantity > 0 ? sellCalc.totalValue / sellCalc.totalQuantity : 0

  // Calculate P&L if both buy and sell exist
  const netQuantity = buyCalc.totalQuantity - sellCalc.totalQuantity
  const realizedPnL = sellCalc.totalQuantity > 0 && avgBuyPrice > 0 
    ? (avgSellPrice - avgBuyPrice) * Math.min(buyCalc.totalQuantity, sellCalc.totalQuantity)
    : 0

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Calculation Summary
          <Badge variant="outline">{selectedRows.length} rows selected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overall Summary */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Overall</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Avg Price:</span>
                <span className="font-mono text-sm">{averagePrice.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Qty:</span>
                <span className="font-mono text-sm">{calculations.totalQuantity.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Value:</span>
                <span className="font-mono text-sm">{calculations.totalValue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Buy Summary */}
          {buyData.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-green-600 dark:text-green-400">
                Buys ({buyData.length})
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Avg Price:</span>
                  <span className="font-mono text-sm">{avgBuyPrice.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Qty:</span>
                  <span className="font-mono text-sm">{buyCalc.totalQuantity.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Value:</span>
                  <span className="font-mono text-sm">{buyCalc.totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Sell Summary */}
          {sellData.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-red-600 dark:text-red-400">
                Sells ({sellData.length})
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Avg Price:</span>
                  <span className="font-mono text-sm">{avgSellPrice.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Qty:</span>
                  <span className="font-mono text-sm">{sellCalc.totalQuantity.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Value:</span>
                  <span className="font-mono text-sm">{sellCalc.totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* P&L Summary */}
          {buyData.length > 0 && sellData.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">P&L Analysis</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Net Qty:</span>
                  <span className="font-mono text-sm">{netQuantity.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Realized P&L:</span>
                  <span className={`font-mono text-sm ${
                    realizedPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {realizedPnL >= 0 ? '+' : ''}{realizedPnL.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Price Diff:</span>
                  <span className={`font-mono text-sm ${
                    (avgSellPrice - avgBuyPrice) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {avgSellPrice - avgBuyPrice >= 0 ? '+' : ''}{(avgSellPrice - avgBuyPrice).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}