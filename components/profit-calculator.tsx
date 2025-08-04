"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TableRow } from '@/types'
import { Calculator, TrendingUp, TrendingDown } from 'lucide-react'

interface ProfitCalculatorProps {
  data: TableRow[]
  selectedRows: number[]
}

export function ProfitCalculator({ data, selectedRows }: ProfitCalculatorProps) {
  const [sellPrice, setSellPrice] = useState<string>('')

  if (selectedRows.length === 0) {
    return null
  }

  const selectedData = selectedRows.map(index => data[index])

  // Only consider buy orders for profit calculation
  const buyData = selectedData.filter(row => row.Side === 'Buy')
  
  if (buyData.length === 0) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Profit Calculator
            <Badge variant="outline">{selectedRows.length} rows selected</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Select some buy orders to calculate potential profits
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate buy position
  const buyPosition = buyData.reduce((acc, row) => {
    const price = parseFloat(String(row['Filled Price'] || 0))
    const quantity = parseFloat(String(row['Executed Amount'] || 0))
    const fee = parseFloat(String(row['Fee'] || 0))

    if (!isNaN(price) && !isNaN(quantity)) {
      acc.totalValue += price * quantity
      acc.totalQuantity += quantity
      acc.totalFees += fee
    }
    return acc
  }, { totalValue: 0, totalQuantity: 0, totalFees: 0 })

  const avgBuyPrice = buyPosition.totalQuantity > 0 ? buyPosition.totalValue / buyPosition.totalQuantity : 0
  const currentSellPrice = parseFloat(sellPrice) || 0

  // Calculate profits
  const profitPerCoin = currentSellPrice - avgBuyPrice
  const profitPercentage = avgBuyPrice > 0 ? (profitPerCoin / avgBuyPrice) * 100 : 0
  const totalProfitUSDT = profitPerCoin * buyPosition.totalQuantity
  const totalProfitCoins = buyPosition.totalQuantity * (profitPercentage / 100)

  // Break-even price (including fees)
  const breakEvenPrice = avgBuyPrice * (1 + (buyPosition.totalFees / buyPosition.totalValue))

  // Get currency pair for display
  const currencyPair = selectedData[0]?.Pairs || 'CRYPTO'
  const baseCurrency = currencyPair.split('_')[0] || 'CRYPTO'

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Profit Calculator
          <Badge variant="outline">{buyData.length} buy orders selected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Position Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Average Buy Price</p>
            <p className="text-lg font-mono font-semibold">${avgBuyPrice.toFixed(4)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Quantity</p>
            <p className="text-lg font-mono font-semibold">{buyPosition.totalQuantity.toFixed(6)} {baseCurrency}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Invested</p>
            <p className="text-lg font-mono font-semibold">${buyPosition.totalValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Sell Price Input */}
        <div className="space-y-2">
          <Label htmlFor="sellPrice" className="text-sm font-medium">
            Target Sell Price (USDT)
          </Label>
          <Input
            id="sellPrice"
            type="number"
            step="0.0001"
            placeholder={`Enter sell price for ${baseCurrency}...`}
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            className="font-mono"
          />
        </div>

        {/* Profit Calculations */}
        {currentSellPrice > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profit Summary */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  {profitPerCoin >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <h4 className="font-semibold text-sm">Profit Analysis</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Profit per {baseCurrency}:</span>
                    <span className={`font-mono text-sm font-semibold ${
                      profitPerCoin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ${profitPerCoin >= 0 ? '+' : ''}{profitPerCoin.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Profit Percentage:</span>
                    <span className={`font-mono text-sm font-semibold ${
                      profitPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Card>

              {/* Total Returns */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-blue-500" />
                  <h4 className="font-semibold text-sm">Total Returns</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Profit (USDT):</span>
                    <span className={`font-mono text-sm font-semibold ${
                      totalProfitUSDT >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ${totalProfitUSDT >= 0 ? '+' : ''}{totalProfitUSDT.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sell Value:</span>
                    <span className="font-mono text-sm font-semibold">
                      ${(currentSellPrice * buyPosition.totalQuantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Break-even Analysis */}
            <div className="p-4 bg-muted/10 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm">Break-even Analysis</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-sm">Break-even price:</span>
                  <span className="font-mono text-sm">${breakEvenPrice.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Distance to break-even:</span>
                  <span className={`font-mono text-sm ${
                    currentSellPrice >= breakEvenPrice ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {currentSellPrice >= breakEvenPrice ? '+' : ''}{((currentSellPrice - breakEvenPrice) / breakEvenPrice * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}