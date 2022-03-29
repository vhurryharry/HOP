import usePriceData from "../utils/usePriceData";
import { ISymbol } from "../utils/useSymbols";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface IPriceChartProps {
  symbol?: ISymbol;
}

const PriceChart = ({ symbol }: IPriceChartProps) => {
  const data = usePriceData(symbol?.symbol);

  if (!symbol) return <div>Please select a symbol</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <ResponsiveContainer width="95%" height="95%">
      <LineChart
        data={data.data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
        <Line
          type="monotone"
          dataKey="prediction"
          stroke="#82ca9d"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
