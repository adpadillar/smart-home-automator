import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { es } from "date-fns/locale";

import {
  CategoryScale,
  Chart,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  TimeScale,
  TimeSeriesScale,
} from "chart.js";

Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(TimeScale);
Chart.register(TimeSeriesScale);
Chart.register(Title);
Chart.register(Tooltip);

import React, { useEffect } from "react";
import { useRefData } from "~/client/hooks/useRefData";
import { type Measurement } from "~/client/utils/determineActions";
import { type Sensor } from "./AddAutomation";

interface LineChartProps {
  children?: React.ReactNode;
  sensor: Sensor & { id: string };
}

const LineChart: React.FC<LineChartProps> = ({ sensor }) => {
  const { id: sensorId } = sensor;
  const [data, loading] = useRefData<Measurement>(
    "measurements",
    (s) => s.sensorId == sensorId,
    (a, b) => a.timestamp - b.timestamp,
  );

  useEffect(() => {
    console.log(data);
  }, [data, loading]);

  if (!loading && !data) return null;

  const getUnit = (val: string) => {
    switch (sensor.type) {
      case "temperature":
        return `${val} °C`;
      case "gas":
        return `${val} ppm`;
      case "movement":
        return `${val == "1" ? "Movement" : "No movement"}`;
      case "rain":
        return `${val == "1" ? "Raining" : "Not raining"}`;
      default:
        return val;
    }
  };

  return (
    <Line
      datasetIdKey="id"
      options={{
        elements: {
          line: {
            tension: 0.4,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (item) => {
                return getUnit(item.formattedValue);
              },
            },
          },
          title: {
            display: true,
            text: sensor.name,
          },
        },

        scales: {
          y: {
            title: {
              display: true,
              text: "Medición Sensor",
            },
          },
          x: {
            title: {
              display: true,
              text: "Time",
            },
            type: "time",
            adapters: {
              date: {
                locale: es,
              },
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 8,
            },
            time: {
              displayFormats: {
                millisecond: "HH:mm",
                second: "HH:mm",
                minute: "HH:mm",
                hour: "HH:mm",
                day: "HH:mm",
                week: "HH:mm",
                month: "HH:mm",
                quarter: "HH:mm",
                year: "HH:mm",
              },
              tooltipFormat: "dd MMM HH:mm:ss",
            },
          },
        },
      }}
      data={{
        datasets: [
          {
            borderColor: "lightblue",
            label: "Sensor Data",
            data: data?.map((m) => ({
              x: m.timestamp,
              y: m.value,
            })),
          },
        ],
      }}
    />
  );
};

export default LineChart;
