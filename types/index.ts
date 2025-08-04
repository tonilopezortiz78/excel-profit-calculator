export interface TableRow {
  [key: string]: string | number | null | undefined
}

export interface TradingData {
  Pairs?: string
  Time?: string
  Side?: 'Buy' | 'Sell'
  'Filled Price'?: number
  'Executed Amount'?: number
  Total?: number
  Fee?: number
  Role?: string
}

export interface ExcelData {
  data: TableRow[]
  headers: string[]
  fileName: string
}