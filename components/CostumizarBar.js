import React from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

function CustomBarChart({ data }) {
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // #3b82f6
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    barRadius: 4,
  };

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
      },
    ],
  };

  return (
    <BarChart
      data={chartData}
      width={screenWidth - 40}
      height={200}
      chartConfig={chartConfig}
      style={{ borderRadius: 8 }}
    />
  );
}

export default CustomBarChart;