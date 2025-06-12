
import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, Alert, StyleSheet } from "react-native";
import { Appbar, TextInput, Button, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import styles from '../styles/stylesDashboard';
import { fetchDashboardData, filterCasesByDate, getCaseTypeData, getStatusData, getGenderData } from '../services/dashboardServices';

const screenWidth = Dimensions.get('window').width;

function DashboardScreen({ navigation }) {
  const [userName, setUserName] = useState('Usuário');
  const [cases, setCases] = useState([]);
  const [victims, setVictims] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [startDate, setStartDate] = useState('06/2024');
  const [endDate, setEndDate] = useState('09/2024');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          setUserName(parsed.name || 'Usuário');
        }

        const { cases, victims } = await fetchDashboardData();
        setCases(cases);
        setVictims(victims);
        setFilteredCases(cases);
        setError(null);
      } catch (err) {
        const errorMessage = err.message || 'Erro ao carregar dados';
        setError(errorMessage);
        Alert.alert('Erro', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateDate = (date) => {
    const regex = /^(0[6-9]|1[0-2])\/2024$/;
    return regex.test(date);
  };

  const handleApplyFilter = () => {
    if (!validateDate(startDate) || !validateDate(endDate)) {
      Alert.alert('Erro', 'Formato de data inválido. Use MM/YYYY entre 06/2024 e 12/2024.');
      return;
    }

    const filtered = filterCasesByDate(cases, startDate, endDate);
    setFilteredCases(filtered);
    Alert.alert('Filtro Aplicado', `${filtered.length} casos encontrados no período.`);
  };

  const exportReport = async () => {
    try {
      const csvData = [
        ['ID', 'Título', 'Classificação', 'Status', 'Data do Fato'],
        ...filteredCases.map((c) => [
          c.id,
          c.title,
          c.classification,
          c.statusCase,
          c.dateFact,
        ]),
        [],
        ['ID', 'Nome', 'Sexo', 'Caso Associado'],
        ...victims.map((v) => [
          v.id,
          v.name,
          v.sex === 'M' ? 'Masculino' : 'Feminino',
          v.caseId || '-',
        ]),
      ]
        .map((row) => row.join(','))
        .join('\n');

      const fileUri = `${FileSystem.documentDirectory}dashboard_report.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvData);
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv' });
      Alert.alert('Sucesso', 'Relatório exportado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Falha ao exportar relatório.');
    }
  };

  const barChartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // #3b82f6
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
    barRadius: 4,
  };

  const pieChartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(136, 132, 216, ${opacity})`, // #8884d8
    decimalPlaces: 0,
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          color="#2d4a78"
          size={30}
          icon="menu"
          onPress={() => navigation.toggleDrawer()}
        />
        <View style={styles.user}>
          <MaterialIcons name="person" size={30} color="#2d4a78" />
          <Text style={styles.userText}>{userName}</Text>
          <Appbar.Action
            color="#2d4a78"
            size={30}
            icon="download"
            onPress={exportReport}
          />
        </View>
      </Appbar.Header>

      <ScrollView style={styles.main}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dashboard</Text>

          {/* Filtro de Data */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Filtro de Data</Text>
            <Text style={styles.cardDescription}>Selecione o período (MM/YYYY)</Text>
            <View style={styles.filterContainer}>
              <TextInput
                label="Data Inicial"
                value={startDate}
                onChangeText={setStartDate}
                mode="outlined"
                placeholder="06/2024"
                style={styles.filterInput}
              />
              <TextInput
                label="Data Final"
                value={endDate}
                onChangeText={setEndDate}
                mode="outlined"
                placeholder="09/2024"
                style={styles.filterInput}
              />
            </View>
            <Button
              mode="contained"
              onPress={handleApplyFilter}
              style={{ backgroundColor: '#6200ee' }}
            >
              Aplicar Filtro
            </Button>
          </View>

          {/* Gráfico de Tipo de Caso */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tipo de Casos</Text>
            <Text style={styles.cardDescription}>Distribuição por classificação</Text>
            <BarChart
              data={{
                labels: getCaseTypeData(filteredCases).map((item) => item.name),
                datasets: [
                  {
                    data: getCaseTypeData(filteredCases).map((item) => item.value),
                  },
                ],
              }}
              width={screenWidth - 80}
              height={220}
              chartConfig={barChartConfig}
              style={{ alignSelf: 'center' }}
            />
          </View>

          {/* Gráfico de Status */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Status dos Casos</Text>
            <Text style={styles.cardDescription}>Situação atual dos casos</Text>
            <PieChart
              data={getStatusData(filteredCases).map((item) => ({
                name: item.name,
                count: item.value,
                color: item.color,
                legendFontColor: '#333',
                legendFontSize: 14,
              }))}
              width={screenWidth - 80}
              height={220}
              chartConfig={pieChartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={{ alignSelf: 'center' }}
              hasLegend={true}
            />
          </View>

          {/* Gráfico de Sexo */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sexo das Vítimas</Text>
            <Text style={styles.cardDescription}>Distribuição por gênero</Text>
            <PieChart
              data={getGenderData(victims).map((item) => ({
                name: item.name,
                count: item.value,
                color: item.color,
                legendFontColor: '#333',
                legendFontSize: 14,
              }))}
              width={screenWidth - 80}
              height={220}
              chartConfig={pieChartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={{ alignSelf: 'center' }}
              hasLegend={true}
            />
          </View>

          {/* Gráfico de Resumo por Período */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumo por Período</Text>
            <Text style={styles.cardDescription}>{`Casos de ${startDate} a ${endDate}`}</Text>
            <PieChart
              data={getStatusData(filteredCases).map((item) => ({
                name: item.name,
                count: item.value,
                color: item.color,
                legendFontColor: '#333',
                legendFontSize: 14,
              }))}
              width={screenWidth - 80}
              height={220}
              chartConfig={pieChartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={{ alignSelf: 'center' }}
              hasLegend={true}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.menuNav}>
        <View style={styles.menuNavi}>
          <MaterialIcons name="home" size={40} color="#2d4a78" />
          <MaterialIcons name="add-circle" size={40} color="#2d4a78" />
          <MaterialIcons name="search" size={40} color="#2d4a78" />
        </View>
      </View>
    </View>
  );
}

export default DashboardScreen;
