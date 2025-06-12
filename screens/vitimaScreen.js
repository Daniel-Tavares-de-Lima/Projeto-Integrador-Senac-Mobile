
import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Appbar, Button, TextInput, Menu, Divider, TouchableRipple, Portal, Modal } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/stylesHome";
import stylesCases from "../styles/stylesCases";
import stylesVictims from "../styles/stylesVitima";
// import DocumentPicker from "react-native-document-picker";
import * as DocumentPicker from 'expo-document-picker';
import { StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {fetchCases,createCase,updateCase,deleteCase,} from "../services/casosServices";
import {createVictim,fetchVictims,updateVictim,deleteVictim,} from "../services/vitimaServices";



function VictimsScreen({ navigation }) {
  const [nic, setNic] = useState('');
  const [pesquisar, setPesquisar] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [document, setDocument] = useState('');
  const [address, setAddress] = useState('');
  const [odontogram, setOdontogram] = useState('');
  const [anatomicalNotes, setAnatomicalNotes] = useState('');
  const [gender, setGender] = useState('');
  const [showGender, setShowGender] = useState(false);
  const [ethnicity, setEthnicity] = useState('');
  const [showEthnicity, setShowEthnicity] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [victims, setVictims] = useState([]);
  const [filteredVictims, setFilteredVictims] = useState([]);
  const [cases, setCases] = useState([]);
  const [arquivo, setArquivo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editVictimId, setEditVictimId] = useState(null);
  const [userName, setUserName] = useState('Usuário');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVictim, setSelectedVictim] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          setUserName(parsed.name || 'Usuário');
        }

        const [victimsData, casesData] = await Promise.all([
          fetchVictims().catch(err => {
            console.error('Erro ao buscar vítimas:', err.message);
            return [];
          }),
          fetchCases().catch(err => {
            console.error('Erro ao buscar casos:', err.message);
            return [];
          }),
        ]);

        setVictims(Array.isArray(victimsData) ? victimsData : []);
        setFilteredVictims(Array.isArray(victimsData) ? victimsData : []);
        setCases(Array.isArray(casesData) ? casesData : []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados');
        console.error('Erro em fetchData:', err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = victims.filter(
      victim =>
        victim.name.toLowerCase().includes(pesquisar.toLowerCase()) ||
        victim.nic.toLowerCase().includes(pesquisar.toLowerCase())
    );
    setFilteredVictims(filtered);
  }, [pesquisar, victims]);

  const handleEscolherArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.type === 'success') {
        setArquivo({ name: result.name, uri: result.uri });
        Alert.alert('Sucesso', `Arquivo selecionado: ${result.name}`);
      }
    } catch (err) {
      console.error('Erro ao selecionar documento:', err);
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
    }
  };

  const handleSaveVictim = async () => {
    if (!nic || !name || !gender || !caseId || !anatomicalNotes) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (NIC, Nome, Gênero, Caso, Anotações Anatômicas).');
      return;
    }

    try {
      if (editVictimId) {
        await updateVictim(
          editVictimId,
          nic,
          name,
          gender,
          birthDate,
          document,
          address,
          ethnicity,
          odontogram,
          anatomicalNotes,
          caseId
        );
        Alert.alert('Sucesso', 'Vítima atualizada com sucesso!');
        setEditVictimId(null);
      } else {
        await createVictim(
          nic,
          name,
          gender,
          birthDate,
          document,
          address,
          ethnicity,
          odontogram,
          anatomicalNotes,
          caseId
        );
        Alert.alert('Sucesso', 'Vítima cadastrada com sucesso!');
      }

      const victimsData = await fetchVictims();
      setVictims(Array.isArray(victimsData) ? victimsData : []);
      setFilteredVictims(Array.isArray(victimsData) ? victimsData : []);
      resetForm();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao salvar vítima');
      console.error('Erro ao salvar vítima:', error.message);
    }
  };

  const resetForm = () => {
    setNic('');
    setName('');
    setGender('');
    setBirthDate('');
    setDocument('');
    setAddress('');
    setEthnicity('');
    setOdontogram('');
    setAnatomicalNotes('');
    setCaseId('');
    setArquivo(null);
    setEditVictimId(null);
  };

  const handleEditVictim = victim => {
    setEditVictimId(victim.id);
    setNic(victim.nic || '');
    setName(victim.name || '');
    setGender(victim.sex === 'M' ? 'Masculino' : 'Feminino');
    setBirthDate(victim.birthDate || '');
    setDocument(victim.document || '');
    setAddress(victim.address || '');
    setEthnicity(victim.ethnicity || '');
    setOdontogram(victim.odontogramEntries?.[0]?.note || '');
    setAnatomicalNotes(victim.anatomicalNotes || '');
    setCaseId(victim.caseId || '');
    setModalVisible(false);
  };

  const handleDeleteVictim = victimId => {
    Alert.alert('Confirmar Exclusão', 'Tem certeza que deseja excluir esta vítima?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteVictim(victimId);
            const victimsData = await fetchVictims();
            setVictims(Array.isArray(victimsData) ? victimsData : []);
            setFilteredVictims(Array.isArray(victimsData) ? victimsData : []);
            Alert.alert('Sucesso', 'Vítima excluída com sucesso!');
            setModalVisible(false);
          } catch (error) {
            Alert.alert('Erro', error.message || 'Falha ao excluir vítima');
            console.error('Erro ao excluir vítima:', error.message);
          }
        },
      },
    ]);
  };

  const handleViewVictim = victim => {
    setSelectedVictim(victim);
    setModalVisible(true);
  };

  const getAge = birthDate => {
    if (!birthDate) return '-';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  const getStatusStyle = useCallback(status => {
    switch (status) {
      case 'FINALIZADO':
        return localStyles.statusFinalizado;
      case 'ANDAMENTO':
        return localStyles.statusAndamento;
      case 'ARQUIVADO':
        return localStyles.statusArquivado;
      default:
        return localStyles.statusDefault;
    }
  }, []);

  const renderVictimRow = useCallback(
    (victim, index) => (
      <View key={victim.id || index} style={localStyles.patientRow}>
        <Text style={localStyles.cell}>{victim.id?.slice(0, 8) || '-'}</Text>
        <Text style={localStyles.cell}>{victim.name || '-'}</Text>
        <Text style={localStyles.cell}>
          {victim.sex === 'M' ? 'Masculino' : victim.sex === 'F' ? 'Feminino' : '-'}
        </Text>
        <View style={[localStyles.cell, getStatusStyle(victim.status)]}>
          <Text style={localStyles.statusText}>{victim.status || '-'}</Text>
        </View>
        <View style={[localStyles.cell, localStyles.actionsCell]}>
          <TouchableOpacity
            onPress={() => handleViewVictim(victim)}
            style={localStyles.actionButton}
          >
            <MaterialIcons name='visibility' size={20} color='#2196f3' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEditVictim(victim)}
            style={localStyles.actionButton}
          >
            <MaterialIcons name='edit' size={20} color='#4CAF50' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteVictim(victim.id)}
            style={localStyles.actionButton}
          >
            <MaterialIcons name='delete' size={20} color='#F44336' />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [getStatusStyle]
  );

  const renderModal = () => {
    if (!selectedVictim) return null;
    return (
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={modalStyles.modalContainer}
        >
          <ScrollView>
            <Text style={modalStyles.modalTitle}>Detalhes da Vítima</Text>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>NIC:</Text>
              <Text style={modalStyles.value}>{selectedVictim.nic || '-'}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Nome:</Text>
              <Text style={modalStyles.value}>{selectedVictim.name || '-'}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Gênero:</Text>
              <Text style={modalStyles.value}>
                {selectedVictim.sex === 'M'
                  ? 'Masculino'
                  : selectedVictim.sex === 'F'
                  ? 'Feminino'
                  : '-'}
              </Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Idade:</Text>
              <Text style={modalStyles.value}>{getAge(selectedVictim.birthDate)}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Documento:</Text>
              <Text style={modalStyles.value}>{selectedVictim.document || '-'}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Endereço:</Text>
              <Text style={modalStyles.value}>{selectedVictim.address || '-'}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Cor/Etnia:</Text>
              <Text style={modalStyles.value}>{selectedVictim.ethnicity || '-'}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Caso Associado:</Text>
              <Text style={modalStyles.value}>
                {cases.find(c => c.id === selectedVictim.caseId)?.title || '-'}
              </Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Odontograma:</Text>
              <Text style={modalStyles.value}>
                {selectedVictim.odontogramEntries?.[0]?.note || '-'}
              </Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Anotações Anatômicas:</Text>
              <Text style={modalStyles.value}>
                {selectedVictim.anatomicalNotes || '-'}
              </Text>
            </View>
            <View style={modalStyles.buttonContainer}>
              <Button
                mode='contained'
                onPress={() => handleEditVictim(selectedVictim)}
                style={modalStyles.button}
              >
                Editar
              </Button>
              <Button
                mode='contained'
                onPress={() => handleDeleteVictim(selectedVictim.id)}
                style={modalStyles.button}
              >
                Excluir
              </Button>
              <Button
                mode='outlined'
                onPress={() => setModalVisible(false)}
                style={modalStyles.button}
              >
                Fechar
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    );
  };

  if (isLoading) {
    return <Text style={stylesVictims.loading}>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={stylesVictims.header}>
        <Appbar.Action
          color='#2d4a78'
          size={35}
          icon='menu'
          onPress={() => navigation.toggleDrawer()}
        />
        <View style={stylesVictims.user}>
          <MaterialIcons name='person' size={35} color='#2d4a78' />
          <Text style={styles.userText}>{userName}</Text>
        </View>
      </Appbar.Header>

      <ScrollView style={styles.main}>
        {error && <Text style={stylesVictims.errorText}>{error}</Text>}

        <TextInput
          label='Pesquisar vítimas por nome ou NIC'
          value={pesquisar}
          onChangeText={setPesquisar}
          mode='outlined'
          style={stylesVictims.inputPesquisar}
        />

        <View style={stylesCases.CadastrarCasos}>
          <Text style={stylesVictims.title}>
            {editVictimId ? 'Editar Vítima' : 'Cadastrar Vítima'}
          </Text>
          <TextInput
            label='NIC*'
            value={nic}
            onChangeText={setNic}
            mode='outlined'
            style={stylesCases.input}
          />
          <TextInput
            label='Nome*'
            value={name}
            onChangeText={setName}
            mode='outlined'
            style={stylesCases.input}
          />
          <Menu
            visible={showGender}
            onDismiss={() => setShowGender(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowGender(true)}
                style={stylesCases.menuInput}
              >
                <Text>{gender || 'Gênero*'}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setGender('Masculino')} title='Masculino' />
            <Menu.Item onPress={() => setGender('Feminino')} title='Feminino' />
          </Menu>
          <TextInput
            label='Data de Nascimento (YYYY-MM-DD)'
            value={birthDate}
            onChangeText={setBirthDate}
            mode='outlined'
            placeholder='YYYY-MM-DD'
            style={stylesCases.input}
          />
          <TextInput
            label='Documento'
            value={document}
            onChangeText={setDocument}
            mode='outlined'
            style={stylesCases.input}
          />
          <TextInput
            label='Endereço'
            value={address}
            onChangeText={setAddress}
            mode='outlined'
            style={stylesCases.input}
          />
          <Menu
            visible={showEthnicity}
            onDismiss={() => setShowEthnicity(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowEthnicity(true)}
                style={stylesCases.menuInput}
              >
                <Text>{ethnicity || 'Cor/Etnia'}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setEthnicity('Preta')} title='Preta' />
            <Menu.Item onPress={() => setEthnicity('Parda')} title='Parda' />
            <Menu.Item onPress={() => setEthnicity('Branca')} title='Branca' />
            <Menu.Item onPress={() => setEthnicity('Amarela')} title='Amarela' />
            <Menu.Item onPress={() => setEthnicity('Indígena')} title='Indígena' />
            <Menu.Item onPress={() => setEthnicity('Não Declarado')} title='Não Declarado' />
          </Menu>
          <Menu
            visible={showCaseMenu}
            onDismiss={() => setShowCaseMenu(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowCaseMenu(true)}
                style={stylesCases.menuInput}
              >
                <Text>
                  {cases.find(c => c.id === caseId)?.title || 'Caso*'}
                </Text>
              </TouchableRipple>
            }
          >
            {cases.map(c => (
              <Menu.Item
                key={c.id}
                onPress={() => setCaseId(c.id)}
                title={c.title || `Caso ${c.id.slice(0, 8)}`}
              />
            ))}
          </Menu>
          <TextInput
            label='Odontograma'
            value={odontogram}
            onChangeText={setOdontogram}
            mode='outlined'
            multiline
            style={stylesCases.input}
          />
          <TextInput
            label='Anotações Anatômicas*'
            value={anatomicalNotes}
            onChangeText={setAnatomicalNotes}
            mode='outlined'
            multiline
            style={stylesCases.input}
          />
          <Button
            icon='file'
            mode='outlined'
            onPress={handleEscolherArquivo}
            style={stylesCases.botaoArquivo}
          >
            Escolher arquivo
          </Button>
          {arquivo && <Text style={stylesCases.infoText}>{arquivo.name}</Text>}
          <Button
            icon='check'
            mode='contained'
            style={stylesCases.botaoSalvar}
            onPress={handleSaveVictim}
          >
            {editVictimId ? 'Atualizar' : 'Salvar'}
          </Button>
          {editVictimId && (
            <Button
              mode='outlined'
              style={stylesCases.botao}
              onPress={resetForm}
            >
              Cancelar
            </Button>
          )}
        </View>

        <View style={localStyles.sectionContainer}>
          <Text style={localStyles.sectionTitle}>Vítimas Recentes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={localStyles.tableContainer}>
              <View style={stylesVictims.tableHeader}>
                <Text style={stylesVictims.headerText}>ID</Text>
                <Text style={stylesVictims.headerText}>Nome</Text>
                <Text style={stylesVictims.headerText}>Gênero</Text>
                <Text style={stylesVictims.headerText}>Status</Text>
                <Text style={stylesVictims.headerText}>Ações</Text>
              </View>
              {filteredVictims.slice(0, 3).map(renderVictimRow)}
            </View>
          </ScrollView>
        </View>

        <View style={localStyles.sectionContainer}>
          <Text style={localStyles.sectionTitle}>Todas as Vítimas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={localStyles.tableContainer}>
              <View style={stylesVictims.tableHeader}>
                <Text style={stylesVictims.headerText}>ID</Text>
                <Text style={stylesVictims.headerText}>Nome</Text>
                <Text style={stylesVictims.headerText}>Gênero</Text>
                <Text style={stylesVictims.headerText}>Status</Text>
                <Text style={stylesVictims.headerText}>Ações</Text>
              </View>
              {filteredVictims.map(renderVictimRow)}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {renderModal()}

      <View style={stylesCases.menuNav}>
        <View style={stylesCases.menuNavi}>
          <MaterialIcons name="home" size={28} color="#3A5BA0" />

          <View style={stylesCases.addButtonWrapper}>
            <MaterialIcons name="add" size={28} color="#fff" />
          </View>

          <MaterialIcons name="search" size={28} color="#3A5BA0" />
        </View>
      </View>
      
    </View>
  );
}

const modalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  detailContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    margin: 5,
    minWidth: 100,
  },
});

const localStyles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableContainer: {
    minWidth: 600,
  },
  patientRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    color: '#333',
  },
  actionsCell: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCell: {
    padding: 5,
    borderRadius: 3,
  },
  statusFinalizado: {
    backgroundColor: '#2196f3',
  },
  statusAndamento: {
    backgroundColor: '#4caf50',
  },
  statusArquivado: {
    backgroundColor: '#f44336',
  },
  statusDefault: {
    backgroundColor: '#1fab00',
    borderRadius: 15,
    height: 20,
  },
  
  statusText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  actionButton: {
    padding: 5,
    marginHorizontal: 5,
  },
});

export default VictimsScreen;