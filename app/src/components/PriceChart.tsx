import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { Button } from "@blueprintjs/core";

import usePriceData from "../utils/usePriceData";
import { ISymbol } from "../utils/useSymbols";

interface IPriceChartProps {
  symbol?: ISymbol;
}

const PriceChart = ({ symbol }: IPriceChartProps) => {
  const priceData = usePriceData(symbol?.symbol);

  const [data, setData] = useState(priceData?.data);
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft] = useState("dataMin");
  const [right, setRight] = useState("dataMax");

  useEffect(() => {
    if (priceData) {
      setData(priceData?.data);

      const [bottom, top] = getAxisYDomain(-1, -1, 20);
      setBottom(bottom);
      setTop(top);
    }
  }, [priceData]);

  const getAxisYDomain = (from, to, offset) => {
    const refData = priceData.data;
    let [bottom, top] = [-1, -1];

    refData.forEach((d) => {
      if (from != -1 && (d.timestamp < from || d.timestamp > to)) return;

      if (top == -1) top = d.price;
      if (d.price > top) top = d.price;
      if (d.prediction > top) top = d.prediction;

      if (bottom == -1) bottom = d.price;
      if (d.price < bottom) bottom = d.price;
      if (d.prediction < bottom) bottom = d.prediction;
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
  };

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setRefAreaRight("");
      setRefAreaLeft("");
      return;
    }

    let rAL = refAreaLeft,
      rAR = refAreaRight;

    // xAxis domain
    if (refAreaLeft > refAreaRight) [rAL, rAR] = [rAR, rAL];

    // yAxis domain
    const [bottom, top] = getAxisYDomain(refAreaLeft, refAreaRight, 20);

    setRefAreaLeft("");
    setRefAreaRight("");
    setData(data.slice());
    setLeft(rAL);
    setRight(rAR);
    setBottom(bottom);
    setTop(top);
  };

  const zoomOut = () => {
    setRefAreaLeft("");
    setRefAreaRight("");
    setData(data.slice());
    setLeft("dataMin");
    setRight("dataMax");

    const [bottom, top] = getAxisYDomain(-1, -1, 20);
    setBottom(bottom);
    setTop(top);
  };

  if (!symbol) return <div>Please select a symbol</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="w-full h-full p-5">
      <Button className="btn update" onClick={zoomOut}>
        Reset Chart
      </Button>

      <ResponsiveContainer width="100%" height="95%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 5,
          }}
          onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel)}
          onMouseMove={(e) =>
            e && refAreaLeft && setRefAreaRight(e.activeLabel)
          }
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            allowDataOverflow
            dataKey="timestamp"
            domain={[left, right]}
            type="number"
            tickFormatter={(unixTime) =>
              new Date(unixTime * 1000).toLocaleDateString()
            }
          />
          <YAxis allowDataOverflow domain={[bottom, top]} type="number" />

          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            dot={false}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="#82ca9d"
            dot={false}
            animationDuration={300}
          />

          {refAreaLeft && refAreaRight ? (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
