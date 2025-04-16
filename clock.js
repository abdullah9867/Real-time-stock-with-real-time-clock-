function StockMarketApp() {
  const [selectedMarkets, setSelectedMarkets] = React.useState(["India"]);
  const [activeMarket, setActiveMarket] = React.useState("India");
  const [stockData, setStockData] = React.useState({});
  const [localTimes, setLocalTimes] = React.useState({});
  const [autoSwitch, setAutoSwitch] = React.useState(false);
  const [switchInterval, setSwitchInterval] = React.useState(10);

  const markets = {
    India: ["TCS", "Reliance", "Infosys"],
    USA: ["AAPL", "GOOGL", "AMZN"],
    UK: ["HSBC", "BP", "Unilever"],
    Japan: ["Toyota", "Sony", "SoftBank"],
    China: ["Alibaba", "Tencent", "Baidu"],
    Germany: ["SAP", "Volkswagen", "Siemens"],
    Russia: ["Gazprom", "Lukoil", "Sberbank"],
    Dubai: ["Emaar", "DP World", "Air Arabia"],
    France: ["LVMH", "TotalEnergies", "Danone"],
  };

  const marketHours = {
    India: { open: "09:15", close: "15:30", timezone: "Asia/Kolkata", gmtOffset: "+5:30" },
    USA: { open: "09:30", close: "16:00", timezone: "America/New_York", gmtOffset: "-4:00" },
    UK: { open: "08:00", close: "16:30", timezone: "Europe/London", gmtOffset: "+1:00" },
    Japan: { open: "09:00", close: "15:00", timezone: "Asia/Tokyo", gmtOffset: "+9:00" },
    China: { open: "09:30", close: "15:00", timezone: "Asia/Shanghai", gmtOffset: "+8:00" },
    Germany: { open: "09:00", close: "17:30", timezone: "Europe/Berlin", gmtOffset: "+2:00" },
    Russia: { open: "10:00", close: "18:00", timezone: "Europe/Moscow", gmtOffset: "+3:00" },
    Dubai: { open: "10:00", close: "14:00", timezone: "Asia/Dubai", gmtOffset: "+4:00" },
    France: { open: "09:00", close: "17:30", timezone: "Europe/Paris", gmtOffset: "+2:00" },
  };

  const updateLocalTimes = () => {
    const newTimes = {};
    Object.keys(marketHours).forEach((market) => {
      const now = new Date();
      newTimes[market] = now.toLocaleTimeString("en-US", {
        timeZone: marketHours[market].timezone,
      });
    });
    setLocalTimes(newTimes);
  };

  const isMarketOpen = (market) => {
    const { open, close, timezone } = marketHours[market];
    const now = new Date().toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour12: false,
    });
    return now >= open && now <= close;
  };

  const generateRandomStockData = () => {
    const newStockData = {};
    markets[activeMarket].forEach((symbol) => {
      newStockData[symbol] = (Math.random() * 1000 + 100).toFixed(2);
    });
    setStockData(newStockData);
  };

  React.useEffect(() => {
    updateLocalTimes();
    const timeInterval = setInterval(updateLocalTimes, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  React.useEffect(() => {
    generateRandomStockData();
    const dataInterval = setInterval(generateRandomStockData, 5000);
    return () => clearInterval(dataInterval);
  }, [activeMarket]);

  React.useEffect(() => {
    if (autoSwitch) {
      const interval = setInterval(() => {
        const currentIndex = selectedMarkets.indexOf(activeMarket);
        const nextIndex = (currentIndex + 1) % selectedMarkets.length;
        setActiveMarket(selectedMarkets[nextIndex]);
      }, switchInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoSwitch, selectedMarkets, activeMarket, switchInterval]);

  const toggleMarketSelection = (market) => {
    if (selectedMarkets.includes(market)) {
      const newMarkets = selectedMarkets.filter((m) => m !== market);
      setSelectedMarkets(newMarkets);
      if (market === activeMarket && newMarkets.length > 0) {
        setActiveMarket(newMarkets[0]);
      }
    } else {
      setSelectedMarkets([...selectedMarkets, market]);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-4xl font-bold mb-4 text-green-400">📈 Dynamic Stock Market Tracker With Real Time Clock</h2>

      {/* Market Selection */}
      <div className="mb-4 flex items-center gap-4">
        {Object.keys(markets).map((market) => (
          <label key={market} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedMarkets.includes(market)}
              onChange={() => toggleMarketSelection(market)}
              className="text-green-400"
            />
            {market}
          </label>
        ))}
      </div>

      {/* Auto-switch and Interval */}
      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoSwitch}
            onChange={(e) => setAutoSwitch(e.target.checked)}
            className="text-green-400"
          />
          Auto-switch to open markets
        </label>
        <label className="flex items-center gap-2">
          Manual switch interval (seconds):
          <input
            type="number"
            value={switchInterval}
            onChange={(e) => setSwitchInterval(Number(e.target.value) || 1)}
            className="border p-1 rounded bg-gray-800 text-green-400"
            min="1"
          />
        </label>
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded shadow-md"
          onClick={() => {
            const currentIndex = selectedMarkets.indexOf(activeMarket);
            const nextIndex = (currentIndex + 1) % selectedMarkets.length;
            setActiveMarket(selectedMarkets[nextIndex]);
          }}
        >
          Manual Switch
        </button>
      </div>

      {/* Active Market Display */}
      <div className="border p-6 rounded-lg bg-gray-800 shadow-lg flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-2 text-green-400">Currently Tracking</h3>
        <p className="text-xl font-semibold mb-4">{activeMarket} Stock Market</p>
        <div className="flex flex-col items-center mb-4">
          <div
            className={`px-4 py-2 text-lg font-bold rounded-full mb-2 ${
              isMarketOpen(activeMarket) ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {isMarketOpen(activeMarket) ? "MARKET OPEN" : "MARKET CLOSED"}
          </div>
          <div className="font-mono text-3xl px-4 py-2 border rounded-lg shadow-md bg-gray-900 text-green-400">
            {localTimes[activeMarket] || "Loading..."}
          </div>
        </div>
        <div className="flex gap-8 text-center">
          {markets[activeMarket].map((symbol) => (
            <p key={symbol} className="font-mono text-lg">
              {symbol}: {stockData[symbol] || "Loading..."}
            </p>
          ))}
        </div>
      </div>

      {/* Local Times for All Markets */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2 text-green-400">Market Local Times</h3>
        <div className="flex flex-wrap gap-4">
          {Object.keys(marketHours).map((market) => (
            <div
              key={market}
              className={`p-4 border rounded-lg shadow-md ${
                market === activeMarket ? "bg-gray-700" : "bg-gray-800"
              }`}
            >
              <h4 className="font-bold">{market}</h4>
              <p className="font-mono text-green-400">Local Time: {localTimes[market] || "Loading..."}</p>
              <p className="text-sm text-gray-400">GMT Offset: {marketHours[market].gmtOffset}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<StockMarketApp />);
