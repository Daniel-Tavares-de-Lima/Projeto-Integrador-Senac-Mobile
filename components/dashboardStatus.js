import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card, CardContent, Title, Paragraph } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

function DashboardStats({ totalCases, activeCases, finishedCases, archivedCases }) {
  const stats = [
    {
      title: "Total de Casos",
      value: totalCases,
      description: "Casos registrados",
      icon: "trending-up",
      iconColor: "#2563eb",
      bgColor: "#eff6ff",
    },
    {
      title: "Em Andamento",
      value: activeCases,
      description: "Casos ativos",
      icon: "warning",
      iconColor: "#d97706",
      bgColor: "#fefce8",
    },
    {
      title: "Finalizados",
      value: finishedCases,
      description: "Casos concluídos",
      icon: "check-circle",
      iconColor: "#16a34a",
      bgColor: "#f0fdf4",
    },
    {
      title: "Arquivados",
      value: archivedCases,
      description: "Casos arquivados",
      icon: "archive",
      iconColor: "#dc2626",
      bgColor: "#fef2f2",
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <Card key={stat.title} style={styles.card}>
          <CardContent style={styles.cardContent}>
            <View style={styles.header}>
              <Title style={styles.cardTitle}>{stat.title}</Title>
              <View style={[styles.iconContainer, { backgroundColor: stat.bgColor }]}>
                <MaterialIcons name={stat.icon} size={24} color={stat.iconColor} />
              </View>
            </View>
            <Text style={styles.value}>{stat.value}</Text>
            <Paragraph style={styles.description}>{stat.description}</Paragraph>
          </CardContent>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    marginBottom: 10,
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  cardContent: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 9999,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 12,
    color: "#6b7280",
  },
});

export default DashboardStats;