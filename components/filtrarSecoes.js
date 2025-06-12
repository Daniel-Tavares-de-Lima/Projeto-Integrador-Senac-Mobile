import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, CardContent, Title, Paragraph, TextInput, Button } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

function FilterSection({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
}) {
  return (
    <Card style={styles.card}>
      <CardContent>
        <View style={styles.header}>
          <MaterialIcons name="filter-list" size={20} color="#333" style={styles.icon} />
          <Title style={styles.title}>Filtro de Data</Title>
        </View>
        <Paragraph style={styles.description}>
          Selecione o período para análise dos dados (MM/YYYY)
        </Paragraph>
      </CardContent>
      <CardContent>
        <View style={styles.filterContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Data Inicial"
              value={startDate}
              onChangeText={onStartDateChange}
              mode="outlined"
              placeholder="06/2024"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label="Data Final"
              value={endDate}
              onChangeText={onEndDateChange}
              mode="outlined"
              placeholder="09/2024"
              style={styles.input}
            />
          </View>
          <Button
            mode="contained"
            onPress={onApplyFilter}
            style={styles.button}
            icon={() => <MaterialIcons name="calendar-today" size={16} color="#fff" />}
          >
            Aplicar Filtro
          </Button>
        </View>
      </CardContent>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
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
  filterContainer: {
    flexDirection: "column",
    gap: 10,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#6200ee",
  },
});

export default FilterSection;