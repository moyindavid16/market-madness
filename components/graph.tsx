import AbstractChart from "./ui/chart";

interface graphProps {
  width?: number;
  height?: number;
  alt?: string;
}

const Graph: React.FC<graphProps> = ({
  width = 600,
  height = 400,
  alt = 'I AM A GRAPH'
}) => {
  return (
    <AbstractChart 
      instrumentName="S&P 500"
      data={[
        ["2024-08-20T13:00:00Z", 227.01], 
        ["2024-08-20T14:00:00Z", 225.96], 
        ["2024-08-20T15:00:00Z", 226.93],
        ["2024-08-20T16:00:00Z", 226.50],
        ["2024-08-20T17:00:00Z", 228.40],
        ["2024-08-20T18:00:00Z", 228.90],
        ["2024-08-20T19:00:00Z", 230.5],
      ]}
      inflationData={[
        ["2024-08-20T13:00:00Z", 227.01],
        ["2024-08-20T19:00:00Z", 229.00],
      ]}
      intrestRatesData={[
        ["2024-08-20T13:00:00Z", 227.01],
        ["2024-08-20T19:00:00Z", 230.30],
      ]}
      SPYData={[
        ["2024-08-20T13:00:00Z", 227.01],
        ["2024-08-20T19:00:00Z", 234.30],
      ]}
      className="bg-[#0C0A09] pt-6"
    />
  );
};

export default Graph;