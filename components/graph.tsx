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
    const data = useStockData(symbol) as unknown as {time: string, price: number, name: string} [];

    const latestDate = new Date(data[0].time);
    const earliestDate = new Date(data[data.length - 1].time);
    
    const timeDifference = latestDate.getTime() - earliestDate.getTime();
    
    const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;
    
    const fractionOfYear = timeDifference / millisecondsInYear;

    const chartData = data.map((record) => [record.time, record.price]) as unknown as [string, number][];
    const chartInflationEndValue = data[0].price + data[0].price * fractionOfYear * 0.03;
    const chartRatesEndValue = data[0].price + data[0].price * fractionOfYear * 0.0425;
    const chartSPXEndValue = data[0].price + data[0].price * fractionOfYear * 0.105;

    return (
      <AbstractChart 
        instrumentName="S&P 500"
        data={chartData}
        inflationData={[
          [data[0].time, data[0].price],
          [data[data.length - 1].time, chartInflationEndValue],
        ]}
        intrestRatesData={[
          [data[0].time, data[0].price],
          [data[data.length - 1].time, chartRatesEndValue],
        ]}
        SPYData={[
          [data[0].time, data[0].price],
          [data[data.length - 1].time, chartSPXEndValue],
        ]}
        className="bg-[#0C0A09] pt-6"
      />
    );
  }
};

export default Graph;