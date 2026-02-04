# Stock Market Widget

A modern, real-time stock market widget built with React and Chart.js that displays live stock prices with mini intraday charts.

## Features

- **Real-time Price Updates**: Auto-refreshes every 60 seconds
- **Mini Intraday Charts**: Displays last 30 minutes of 1-minute price data
- **Visual Price Changes**: Green for positive, red for negative
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode Support**: Automatically adapts to your theme
- **Clean UI**: Minimal charts with no axes, legends, or markers

## Setup Instructions

### 1. Get Your FMP API Key

1. Visit [Financial Modeling Prep](https://financialmodelingprep.com/)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Configure the API Key

Open `frontend/src/components/StockWidget.jsx` and replace the API key:

```javascript
const FMP_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key
```

### 3. Install Dependencies

Chart.js is already installed. If you need to reinstall:

```bash
cd frontend
npm install chart.js
```

### 4. Usage

The widget is already integrated into the Dashboard page. It will automatically display stock cards for:

- AAPL (Apple)
- META (Meta/Facebook)
- AMZN (Amazon)

## Customization

### Add More Stocks

Edit the `STOCK_SYMBOLS` array in `StockWidget.jsx`:

```javascript
const STOCK_SYMBOLS = ["AAPL", "META", "AMZN", "GOOGL", "MSFT"];
```

### Change Refresh Interval

Modify the interval in the `useEffect` (default is 60000ms = 60 seconds):

```javascript
const interval = setInterval(fetchData, 60000); // Change to desired ms
```

### Adjust Chart Data Points

Change the number of data points displayed (default is 30):

```javascript
const last30 = data.slice(0, 30).reverse(); // Change 30 to desired number
```

## API Endpoints Used

1. **Current Quote**: `GET /api/v3/quote/{symbol}`
   - Returns current price, change, and percentage change

2. **Intraday Chart**: `GET /api/v3/historical-chart/1min/{symbol}`
   - Returns 1-minute interval price data

## Component Structure

```
StockWidget.jsx
├── StockWidget (Container)
│   └── Displays section header and grid
└── StockCard (Individual stock card)
    ├── Fetches quote data
    ├── Fetches chart data
    ├── Renders mini chart with Chart.js
    └── Displays price and changes
```

## Error Handling

- **Loading State**: Shows "Loading {SYMBOL}..." while fetching
- **Error State**: Displays error message if API fails
- **Graceful Degradation**: Chart errors won't break the card

## Performance Optimizations

- Charts have animations disabled
- Auto-refresh uses intervals (cleans up on unmount)
- Chart instances are properly destroyed to prevent memory leaks
- Minimal re-renders with proper React hooks

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6 support
- Canvas API for charts

## Troubleshooting

### Cards show "Loading" forever

- Check your API key is valid
- Verify internet connection
- Check browser console for errors

### Charts not displaying

- Ensure Chart.js is installed
- Check canvas element is rendering
- Verify chart data format

### Prices not updating

- Check the auto-refresh interval
- Verify API rate limits aren't exceeded
- Check browser console for fetch errors

## Free API Limits

Financial Modeling Prep free tier typically includes:

- 250 API calls per day
- Real-time data delayed 15 minutes
- Consider upgrading for real real-time data

## License

Part of the capstone project.
