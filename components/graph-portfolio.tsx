import usePortfolioSnapshots from "../app/domains/portfolio/usePortfolioSnapshots";
import AbstractChart from "./ui/chart";

interface graphProps {
  symbol?: string;
  width?: number;
  height?: number;
  alt?: string;
}

const GraphPortfolio = ({ symbol, width, height, alt }: graphProps) => {
  const dataQuery = usePortfolioSnapshots().data;

  if (!dataQuery) {
    return null;
  }

  const data = dataQuery.portfolioData as unknown as {value: number, timestamp: string} [];

  if (data.length === 0) {
    return null;
  }

  const latestDate = new Date(data[data.length - 1].timestamp);
  const earliestDate = new Date(data[0].timestamp);

  const timeDifference = latestDate.getTime() - earliestDate.getTime();

  const millisecondsInYear = 365 * 24 * 60 * 60 * 1000;

  const fractionOfYear = timeDifference / millisecondsInYear;
  const initialPrice = data[0].value;

  const chartData = data.map((record) => [record.timestamp, record.value]) as unknown as [string, number][];
  const chartInflationEndValue = initialPrice + initialPrice * fractionOfYear * 0.03;
  const chartRatesEndValue = initialPrice + initialPrice * fractionOfYear * 0.0425;
  const chartSPXEndValue = initialPrice + initialPrice * fractionOfYear * 0.105;
  chartData.reverse();

  return (
    <AbstractChart 
      instrumentName={"Portfolio :D"}
      data={chartData}
      inflationData={[
        [data[data.length - 1].timestamp, chartInflationEndValue],
        [data[0].timestamp, initialPrice],
      ]}
      intrestRatesData={[
        [data[data.length - 1].timestamp, chartRatesEndValue],
        [data[0].timestamp, initialPrice],
      ]}
      SPYData={[
        [data[data.length - 1].timestamp, chartSPXEndValue],
        [data[0].timestamp, initialPrice],
      ]}
      className="bg-[#0C0A09] pt-6"
    />
  );
};

export default GraphPortfolio;