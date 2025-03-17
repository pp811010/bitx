import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

interface HistoricalData {
  prices: Array<[string, string]>;
}

interface LineChartProps {
  historicalData: HistoricalData | null;
}

const LineChart: React.FC<LineChartProps> = ({ historicalData }) => {
  const [data, setData] = useState([["Date", "Prices"]]);
  
    useEffect(() => {
      let dataCopy = [["Date", "Prices"]];
      if (!historicalData) return;
      if (historicalData.prices) {
        historicalData.prices.map((item) => {
          dataCopy.push([new Date(item[0]).toLocaleDateString().slice(0, 3), item[1]]);
        });
        setData(dataCopy);
        console.log(dataCopy);
      }
    }, [historicalData]);

  const options = {
    legend: { position: "none" },
    backgroundColor: "transparent",
    chartArea: { width: "85%", height: "70%" },
    hAxis: {
      textStyle: { color: "#6B7280", fontSize: 10 },
    },
    vAxis: {
      textStyle: { color: "#6B7280", fontSize: 10 },
      gridlines: { count: 0 },
    },
    colors: ["#10B981"],
    areaOpacity: 1,
    curveType: "function",
  };

  return (
    <div className="w-full p-4 ">
      <Chart
        width="110%"
        height={380}
        chartType="LineChart"
        // chartType="AreaChart"
        data={data}
        options={options}
        loader={<div>Loading Chart...</div>}
      />
    </div>
  );
};

export default LineChart;