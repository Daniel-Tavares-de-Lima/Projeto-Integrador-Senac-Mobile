import React from "react";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

function CustomPieChart({ data }) {
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(136, 132, 216, ${opacity})`, // #8884d8
    decimalPlaces: 0,
  };

  const chartData = data.map((item) => ({
    name: item.name,
    count: item.value,
    color: item.color,
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  return (
    <PieChart
      data={chartData}
      width={screenWidth - 40}
      height={200}
      chartConfig={chartConfig}
      accessor="count"
      backgroundColor="transparent"
      paddingLeft="15"
      absolute
      style={{ borderRadius: 8 }}
      hasLegend={true}
    />
  );
}

export default CustomPieChart;