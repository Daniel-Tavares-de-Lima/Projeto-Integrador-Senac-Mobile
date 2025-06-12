import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Alert, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, Text, Menu, ActivityIndicator } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createEvidence, updateEvidence, deleteEvidence, fetchEvidences, fetchCases } from '../services/evidenciaServices';
import { getUserInfo } from '../services/loginServices';



function EvidenceScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [nome, setNome] = useState('');
  const [dataFato, setDataFato] = useState('');
  const [caseId, setCaseId] = useState('');
  const [showCases, setShowCases] = useState(false);
  const [tipoExames, setTipoExames] = useState('');
  const [showExames, setShowExames] = useState(false);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [location, setLocation] = useState(null);
  const [evidences, setEvidences] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editEvidenceId, setEditEvidenceId] = useState(null);

  const exameOptions = [
    'Exame odontolegal comparativo',
    'Exame antropológico',
    'Exame radiológico',
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getUserInfo();
        if (!user) {
          navigation.replace('Login');
          return;
        }
        setUserName(user.name || 'Usuário');

        // Solicitar permissões de localização
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        } else {
          setError('Permissão de localização negada');
        }

        const evidencesData = await fetchEvidences();
        setEvidences(evidencesData);

        const casesData = await fetchCases();
        setCases(casesData);

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados');
        setLoading(false);
        if (err.message.includes('não autenticado')) {
          navigation.replace('Login');
        }
      }
    }
    loadData();
  }, [navigation]);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Permissão para acessar a câmera foi negada!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.3, // Reduzir qualidade
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Redimensionar a imagem
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }], // Redimensionar para largura máxima de 800px
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage({ uri: manipulatedImage.uri });

      // Converter para base64
      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(blob);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!nome || !dataFato || !caseId || !tipoExames || !imageBase64) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios e capture uma imagem.');
      return;
    }

    try {
      const dateCollection = new Date(dataFato).toISOString();
      if (editEvidenceId) {
        await updateEvidence(
          editEvidenceId,
          'IMAGE',
          dateCollection,
          caseId,
          imageBase64,
          location ? location.latitude : null,
          location ? location.longitude : null,
          nome,
          tipoExames
        );
        Alert.alert('Sucesso', 'Evidência atualizada com sucesso!');
        setEditEvidenceId(null);
      } else {
        await createEvidence(
          'IMAGE',
          dateCollection,
          caseId,
          imageBase64,
          location ? location.latitude : null,
          location ? location.longitude : null,
          nome,
          tipoExames
        );
        Alert.alert('Sucesso', 'Evidência cadastrada com sucesso!');
      }
      resetForm();
      const evidencesData = await fetchEvidences();
      setEvidences(evidencesData);
    } catch (err) {
      if (err.message.includes('Request Entity Too Large') || err.message.includes('413')) {
        Alert.alert(
          'Erro',
          'A imagem é muito grande. Tente capturar uma nova imagem com menor resolução ou qualidade.'
        );
      } else {
        Alert.alert('Erro', err.message || 'Erro ao salvar evidência');
      }
      setError(err.message || 'Erro ao salvar evidência');
    }
  }, [nome, dataFato, caseId, tipoExames, imageBase64, location, editEvidenceId]);

  const resetForm = useCallback(() => {
    setNome('');
    setDataFato('');
    setCaseId('');
    setTipoExames('');
    setImage(null);
    setImageBase64(null);
    setEditEvidenceId(null);
  }, []);

  const parseContent = useCallback((content) => {
    if (!content) return {};
    try {
      return JSON.parse(content);
    } catch (e) {
      console.warn('Erro ao parsear content:', content, e);
      return {};
    }
  }, []);

  const handleEditEvidence = useCallback((evidence) => {
    const contentData = parseContent(evidence.content);
    setEditEvidenceId(evidence.id);
    setNome(contentData.nome || '');
    setDataFato(new Date(evidence.dateCollection).toISOString().split('T')[0]);
    setCaseId(evidence.caseId);
    setTipoExames(contentData.tipoExames || '');
    setImage(evidence.imageURL ? { uri: evidence.imageURL } : null);
    setImageBase64(evidence.imageURL || null);
    setLocation(
      contentData.latitude
        ? {
            latitude: contentData.latitude,
            longitude: contentData.longitude,
          }
        : null
    );
  }, [parseContent]);

  const handleDeleteEvidence = useCallback((evidenceId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja desativar esta evidência?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvidence(evidenceId);
              const evidencesData = await fetchEvidences();
              setEvidences(evidencesData);
              Alert.alert('Sucesso', 'Evidência desativada com sucesso!');
            } catch (err) {
              setError(err.message || 'Erro ao desativar evidência');
            }
          },
        },
      ]
    );
  }, []);

  const handleViewEvidence = useCallback((evidence) => {
    const contentData = parseContent(evidence.content);
    Alert.alert(
      'Detalhes da Evidência',
      JSON.stringify(
        {
          Tipo: evidence.type,
          Nome: contentData.nome || 'Não informado',
          Data: new Date(evidence.dateCollection).toLocaleDateString(),
          Caso: cases.find((c) => c.id === evidence.caseId)?.title || 'Desconhecido',
          TipoExames: contentData.tipoExames || 'Não informado',
          Latitude: contentData.latitude || 'Não informado',
          Longitude: contentData.longitude || 'Não informado',
          Status: evidence.status,
        },
        null,
        2
      )
    );
  }, [cases, parseContent]);

  const getStatusStyle = useCallback((status) => {
    switch (status) {
      case 'ATIVADO':
        return styles.statusBadgeAtivo;
      case 'DESATIVADO':
        return styles.statusBadgeDesativado;
      default:
        return styles.statusBadgeDefault;
    }
  }, []);

  const renderForm = useCallback(() => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Cadastrar Evidência</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TextInput
          label="Nome*"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          label="Data do Fato* (YYYY-MM-DD)"
          value={dataFato}
          onChangeText={setDataFato}
          mode="outlined"
          style={styles.input}
          placeholder="2024-11-20"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Menu
          visible={showCases}
          onDismiss={() => setShowCases(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setShowCases(true)}
              style={styles.menuInput}
            >
              <Text>{cases.find((c) => c.id === caseId)?.title || 'Caso*'}</Text>
            </TouchableOpacity>
          }
        >
          {cases.map((c) => (
            <Menu.Item
              key={c.id}
              onPress={() => {
                setCaseId(c.id);
                setShowCases(false);
              }}
              title={c.title}
            />
          ))}
        </Menu>
        <Menu
          visible={showExames}
          onDismiss={() => setShowExames(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setShowExames(true)}
              style={styles.menuInput}
            >
              <Text>{tipoExames || 'Tipo de Exames*'}</Text>
            </TouchableOpacity>
          }
        >
          {exameOptions.map((option) => (
            <Menu.Item
              key={option}
              onPress={() => {
                setTipoExames(option);
                setShowExames(false);
              }}
              title={option}
            />
          ))}
        </Menu>
        <Button
          icon="camera"
          mode="outlined"
          onPress={pickImage}
          style={styles.button}
        >
          Capturar Imagem
        </Button>
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 8 }}
          />
        )}
        <Button
          icon="content-save"
          mode="contained"
          onPress={handleSave}
          style={styles.button}
        >
          {editEvidenceId ? 'Atualizar' : 'Salvar'}
        </Button>
        {editEvidenceId && (
          <Button
            icon="cancel"
            mode="outlined"
            onPress={resetForm}
            style={styles.button}
          >
            Cancelar
          </Button>
        )}
      </View>
    );
  }, [error, nome, dataFato, caseId, tipoExames, showCases, showExames, image, editEvidenceId, cases, pickImage, handleSave, resetForm]);

  const renderEvidenceRow = useCallback(({ item }) => {
    const contentData = parseContent(item.content);
    return (
      <View style={styles.evidenceRow}>
        <View style={styles.evidenceInfo}>
          <Text style={styles.evidenceCodeText}>{item.id}</Text>
          <Text style={styles.evidenceNameText}>
            {contentData.nome || 'Sem nome'}
          </Text>
          <Text style={styles.evidenceTypeText}>{item.type}</Text>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.evidenceActions}>
          <TouchableOpacity
            onPress={() => handleViewEvidence(item)}
            style={styles.actionButton}
          >
            <MaterialIcons name="visibility" size={20} color="#2196f3" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEditEvidence(item)}
            style={styles.actionButton}
          >
            <MaterialIcons name="edit" size={20} color="#6200ee" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteEvidence(item.id)}
            style={styles.actionButton}
          >
            <MaterialIcons name="delete" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [getStatusStyle, handleViewEvidence, handleEditEvidence, handleDeleteEvidence, parseContent]);

  if (loading) {
    return (
      <View style={styles.viewContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.viewContainer}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          icon="menu"
          color="#2d4a78"
          onPress={() => navigation.toggleDrawer()}
        />
        <Appbar.Content title={userName} style={styles.userInfo} />
        <Appbar.Action
          icon="logout"
          color="#2d4a78"
          onPress={async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userInfo');
            navigation.replace('Login');
          }}
        />
        
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderForm()}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Evidências Cadastradas</Text>
          <FlatList
            data={evidences}
            renderItem={renderEvidenceRow}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma evidência cadastrada</Text>
            }
            scrollEnabled={false} // Desativar rolagem interna da FlatList
          />
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

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    alignItems: 'flex-end',
    color: '#2d4a78',
  },
  scrollContent: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    marginBottom: 10,
  },
  menuInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  evidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 1,
  },
  evidenceInfo: {
    flex: 3,
  },
  evidenceCodeText: {
    fontWeight: 'bold',
    color: '#333',
  },
  evidenceNameText: {
    color: '#333',
  },
  evidenceTypeText: {
    color: '#666',
  },
  statusBadge: {
    padding: 5,
    borderRadius: 4,
    marginTop: 5,
  },
  statusBadgeAtivo: {
    backgroundColor: '#4caf50',
  },
  statusBadgeDesativado: {
    backgroundColor: '#f44336',
  },
  statusBadgeDefault: {
    backgroundColor: '#999',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
  },
  evidenceActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },

  menuNav:{
    backgroundColor: '#fff',
    height: 100,
    justifyContent: 'center',
    alignItems: "center"
  },

  menuNavi:{
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#f5f5f5',
    width: 250,
    borderRadius: 25,
    justifyContent: 'space-around',
    alignItems: 'center'
  }
});

export default EvidenceScreen;