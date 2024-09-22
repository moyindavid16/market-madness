import useStockData from "../app/domains/stocks/useStockData";
import AbstractChart from "./ui/chart";

interface graphProps {
  symbol?: string;
  width?: number;
  height?: number;
  alt?: string;
}

const Graph = ({ symbol, width, height, alt }: graphProps) => {
  if (!symbol) {
    return null;
  } else {
    const dataQuery = useStockData(symbol).data;

    if (!dataQuery) {
      return null;
    }
    
    const data = dataQuery.marketData as unknown as {time: string, price: number, ticker: string} [];

    const latestDate = new Date(data[0].time);
    const earliestDate = new Date(data[data.length - 1].time);
    
    const timeDifference = latestDate.getTime() - earliestDate.getTime();
    
    const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;
    
    const fractionOfYear = timeDifference / millisecondsInYear;
    const initialPrice = data[data.length - 1].price;

    const chartData = data.map((record) => [record.time, record.price]) as unknown as [string, number][];
    const chartInflationEndValue = initialPrice + initialPrice * fractionOfYear * 0.03;
    const chartRatesEndValue = initialPrice + initialPrice * fractionOfYear * 0.0425;
    const chartSPXEndValue = initialPrice + initialPrice * fractionOfYear * 0.105;

    return (
      <AbstractChart 
        instrumentName={data[0].ticker}
        data={chartData}
        inflationData={[
          [data[0].time, chartInflationEndValue],
          [data[data.length - 1].time, initialPrice],
        ]}
        intrestRatesData={[
          [data[0].time, chartRatesEndValue],
          [data[data.length - 1].time, initialPrice],
        ]}
        SPYData={[
          [data[0].time, chartSPXEndValue],
          [data[data.length - 1].time, initialPrice],
        ]}
        className="bg-[#0C0A09] pt-6"
      />
    );
  }
};

export default Graph;