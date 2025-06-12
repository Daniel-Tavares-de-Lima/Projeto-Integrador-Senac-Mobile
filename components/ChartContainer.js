import React from "react";
import { StyleSheet } from "react-native";
import { Card, Content, Title } from "react-native-paper";

export default function ChartContainer({ title, description, children }) {
  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Title style={styles.title}>{title}</Title>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
        <View style={styles.chartContainer}>
          {children}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  chartContainer: {
    height: 220,
    width: "100%",
    alignItems: "center",
  },
});

