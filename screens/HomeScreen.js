import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Appbar, Button, TextInput, DataTable, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/stylesHome';

import caseScreen from './caseScreen';
import PatientScreen from './PatientScreen';

import CasesScreen from "./caseScreen";
import vitimaScreen from "./vitimaScreen"
import DocumentPicker from "react-native-document-picker";


const mockPatients = [
  { id: '1', name: 'João Silva', sex: 'M', birthDate: '1990-01-15', caseId: '1', identified: 'YES' },
  { id: '2', name: 'Maria Santos', sex: 'F', birthDate: '1985-03-22', caseId: '2', identified: 'NO' },
];

const mockCases = [
  { id: '1', title: 'Caso 001', classification: 'Pericial', dateOpened: '2025-01-10', solicitante: 'Dr. Pedro', managerId: 'M001', statusCase: 'ABERTO' },
  { id: '2', title: 'Caso 002', classification: 'Odontológico', dateOpened: '2025-02-20', solicitante: 'Dra. Ana', managerId: 'M002', statusCase: 'FECHADO' },
];

const Drawer = createDrawerNavigator();

function HomeContent({ navigation }) {
  const [userName, setUserName] = useState('Usuário');
  const [patients, setPatients] = useState(mockPatients);
  const [cases, setCases] = useState(mockCases);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getErrorMessage = (error) => {
    return error instanceof Error ? error.message : 'Erro desconhecido';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        setUserName(JSON.parse(userInfo)?.name || 'Julia');
        setPatients(mockPatients);
        setCases(mockCases);
        setError(null);
      } catch (error) {
        setError(getErrorMessage(error));
        setPatients([]);
        setCases([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userInfo');
    console.log('Logout realizado (navegação desativada)');
  };

  const getCaseSolicitante = (caseId) => {
    const caso = cases.find((c) => c && c.id === caseId);
    return caso ? caso.solicitante || '-' : '-';
  };

  if (isLoading) {
    return <Text style={styles.loading}>Carregando...</Text>;
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
          <Appbar.Action icon="logout" onPress={handleLogout} color="#2d4a78" />
        </View>
      </Appbar.Header>
      <ScrollView style={styles.main}>
        <TextInput
          placeholder="Pesquisar casos ou pacientes"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          mode="outlined"
          dense
        />
        <Text style={styles.title}>Painel Inicial</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.searchSection}>
          <TextInput
            label="Data inicial"
            value={startDate}
            onChangeText={setStartDate}
            style={styles.dateInput}
            mode="outlined"
            placeholder="YYYY-MM-DD"
          />
          <TextInput
            label="Data final"
            value={endDate}
            onChangeText={setEndDate}
            style={styles.dateInput}
            mode="outlined"
            placeholder="YYYY-MM-DD"
          />
        </View>
        <Button mode="contained" onPress={() => { }} style={styles.searchButton}>
          Pesquisar
        </Button>
        <Text style={styles.sectionTitle}>Casos</Text>
        <ScrollView horizontal>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.tableHeader}>Código</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Tipo</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Data do Fato</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Local</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Solicitante</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Responsável</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Data do Exame</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Últimos Exames</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Solicitar</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Status</DataTable.Title>
            </DataTable.Header>
            {cases.length > 0 ? (
              cases.map((caso, index) => (
                <DataTable.Row key={caso.id || index}>
                  <DataTable.Cell style={styles.tableCell}>
                    {caso.id ? caso.id.slice(0, 4) : '-'}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    {caso.classification || '-'}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    {caso.dateOpened ? new Date(caso.dateOpened).toLocaleDateString() : '-'}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>-</DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    {caso.solicitante || '-'}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    {caso.managerId || '-'}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>-</DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>-</DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    <Button mode="contained" style={styles.examButton}>
                      Solicitar Exame
                    </Button>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    <Text
                      style={[
                        styles.status,
                        caso.statusCase === 'ABERTO' ? styles.statusAberto :
                          caso.statusCase === 'FECHADO' ? styles.statusFechado :
                            styles.statusDefault,
                      ]}
                    >
                      {caso.statusCase || '-'}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell colSpan={10}>Nenhum caso disponível</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        </ScrollView>
        <Text style={styles.sectionTitle}>Pacientes</Text>
        <ScrollView horizontal>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.tableHeader}>Código</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Nome</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Sexo</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Data de Nascimento</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Solicitante</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Data do Exame</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Últimos Exames</DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Solicitar</DataTable.Title>
            </DataTable.Header>
            {patients.length > 0 ? (
              patients.map((patient, index) => (
                <DataTable.Row key={patient.id || index}>
                  <DataTable.Cell style={styles.tableCell}>
                    {patient.id ? patient.id.slice(0, 4) : '-'}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    {patient.name || '-'}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    {patient.sex || '-'}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : '-'}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    {getCaseSolicitante(patient.caseId)}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>-</DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>-</DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    <Button mode="contained" style={styles.examButton}>
                      Solicitar Exame
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell colSpan={8}>Nenhum paciente disponível</DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        </ScrollView>
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

function HomeScreen() {
  return (
    <PaperProvider>
      <Drawer.Navigator
        initialRouteName="HomeContent"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#2d4a78',
            width: 300,
          },
          drawerLabelStyle: {
            color: '#fff',
            fontSize: 20,
            marginLeft: 5,
          },
          drawerActiveTintColor: '#f4f4f4',
          drawerInactiveTintColor: '#fff',
        }}
      >
        <Drawer.Screen
          name="HomeContent"
          component={HomeContent}
          options={{
            headerShown: false,
            title: 'Laudos Periciais Odonto-Legal',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Cases"
          component={caseScreen}
          options={{
            headerShown: false,
            title: 'Casos',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="assignment" size={size} color={color} />
            ),
          }}
        />

       


        <Drawer.Screen
          name="Vítimas"
          component={vitimaScreen}
          options={{
            headerShown: false,
            title: 'Vítimas',
            drawerIcon: ({ color, size }) => (
              <MaterialIcons name="people" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </PaperProvider>
  );
}

export default HomeScreen;