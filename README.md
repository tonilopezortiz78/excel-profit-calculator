# Excel Profit Calculator

A modern web application for analyzing trading data from Excel files with real-time calculations, responsive tables, and beautiful UI components.

![Excel Profit Calculator](https://img.shields.io/badge/Next.js-15.4.5-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000?style=for-the-badge&logo=react&logoColor=white)

## ✨ Features

### 📊 **File Processing**
- **Drag & Drop Upload** - Simply drag your Excel files into the browser
- **Multiple Formats** - Supports `.xlsx`, `.xls`, and `.csv` files
- **Real-time Processing** - Instant file parsing and data display
- **Error Handling** - Graceful handling of corrupted or unsupported files

### 📈 **Trading Data Analysis**
- **Row Selection** - Select individual rows or all rows with checkboxes
- **Real-time Calculations** - Automatic calculation of:
  - Weighted average prices
  - Total quantities
  - Buy/Sell analysis
  - Profit & Loss calculations
  - Realized P&L with price differences

### 🎨 **Beautiful UI**
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Themes** - Toggle between themes or use system preference
- **Data Formatting** - Smart formatting for:
  - Currency pairs (monospace font)
  - Buy/Sell operations (color-coded green/red)
  - Price decimals (1-4 places)
  - Amount decimals (0-6 places)
- **Sticky Headers** - Table headers stay visible while scrolling

### 🚀 **Performance**
- **Client-side Processing** - No server uploads required
- **Smooth Animations** - Polished transitions and hover effects
- **TypeScript** - Full type safety and better developer experience
- **Modern Stack** - Built with Next.js 15 and shadcn/ui components

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **File Processing**: SheetJS (xlsx)
- **File Upload**: react-dropzone
- **Theme**: next-themes
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tonilopezortiz78/excel-profit-calculator.git
   cd excel-profit-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Usage

1. **Upload File**: Drag and drop your Excel trading file or click to browse
2. **View Data**: Your data appears in a responsive, formatted table
3. **Select Rows**: Use checkboxes to select trades you want to analyze
4. **View Calculations**: Real-time calculations appear above the table showing:
   - Overall averages and totals
   - Buy-specific metrics
   - Sell-specific metrics
   - Profit & Loss analysis
5. **Toggle Theme**: Use the theme switcher in the top-right corner

## 📊 Supported Data Format

The application works best with trading data that includes these columns:
- **Pairs** - Currency pairs (e.g., SOL_USDT, BTC_USDT)
- **Time** - Timestamp of the trade
- **Side** - Buy or Sell
- **Filled Price** - Execution price
- **Executed Amount** - Quantity traded
- **Total** - Total value
- **Fee** - Trading fees
- **Role** - Maker/Taker

## 🎯 Key Features in Detail

### Calculation Engine
- **Weighted Average Price**: Calculated as total value ÷ total quantity
- **Buy/Sell Separation**: Separate calculations for buy and sell orders
- **Realized P&L**: Profit/loss based on actual buy/sell price differences
- **Net Position**: Tracks remaining quantity after offsetting trades

### Data Formatting
- Automatic number formatting based on column type
- Color-coded buy (green) and sell (red) operations
- Proper decimal places for different data types
- Monospace fonts for currency pairs and numbers

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Next.js](https://nextjs.org/) for the amazing React framework
- [SheetJS](https://sheetjs.com/) for Excel file processing
- [Lucide](https://lucide.dev/) for the clean icons

---

Built with ❤️ using Next.js and shadcn/ui