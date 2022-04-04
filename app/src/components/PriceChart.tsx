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
import { Button, Spinner } from "@blueprintjs/core";

import usePriceData from "../utils/usePriceData";
import { ISymbol } from "../utils/useSymbols";

interface IPriceChartProps {
  symbol?: ISymbol;
}

const PriceChart = ({ symbol }: IPriceChartProps) => {
  const { priceData, isLoading, error } = usePriceData(symbol?.symbol);

  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [left, setLeft] = useState("dataMin");
  const [right, setRight] = useState("dataMax");

  useEffect(() => {
    if (priceData) {
      const [bottom, top] = getAxisYDomain(-1, -1, 5);
      setBottom(bottom);
      setTop(top);
      setLeft("dataMin");
      setRight("dataMax");
    }
  }, [isLoading, priceData]);

  const getAxisYDomain = (from, to, offset) => {
    const refData = priceData;
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
    const [bottom, top] = getAxisYDomain(rAL, rAR, 5);

    setRefAreaLeft("");
    setRefAreaRight("");
    setLeft(rAL);
    setRight(rAR);
    setBottom(bottom);
    setTop(top);
  };

  const zoomOut = () => {
    setRefAreaLeft("");
    setRefAreaRight("");

    setLeft("dataMin");
    setRight("dataMax");

    const [bottom, top] = getAxisYDomain(-1, -1, 5);
    setBottom(bottom);
    setTop(top);
  };

  const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();

    return date + " " + month + " " + year;
  };

  const CustomToolTip = ({ payload, label, active }) => {
    if (active && payload) {
      return (
        <div className="drop-shadow-md bg-white p-3">
          <p>{timeConverter(label)}</p>
          {payload.map((p) => (
            <p key={p.dataKey}>
              {p.dataKey}: ${p.value}
            </p>
          ))}
        </div>
      );
    }

    return <div></div>;
  };

  if (!symbol)
    return <div className="text-white p-5">Please select a symbol</div>;

  if (isLoading)
    return (
      <div className="p-5">
        <Spinner />
      </div>
    );

  return (
    <div className="w-full h-full p-5 pb-0">
      <Button className="btn update" onClick={zoomOut}>
        Reset Chart
      </Button>

      <ResponsiveContainer width="100%" height="95%">
        <LineChart
          data={priceData?.slice()}
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
            tickFormatter={timeConverter}
            stroke="#fff"
          />
          <YAxis
            allowDataOverflow
            domain={[bottom, top]}
            type="number"
            stroke="#fff"
          />

          <Tooltip content={CustomToolTip} />
          <Legend />

          <Line
            type="linear"
            dataKey="price"
            stroke="#0070D0"
            strokeWidth={1.5}
            dot={false}
            animationDuration={300}
          />
          <Line
            type="linear"
            dataKey="prediction"
            stroke="#00D070"
            strokeWidth={1.5}
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
