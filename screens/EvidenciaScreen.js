import React, { useState, useEffect, useCallback} from 'react';
import { View, ScrollView, Alert, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, Text, Menu, ActivityIndicator } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createEvidence, updateEvidence, deleteEvidence, fetchEvidences, fetchCases } from '../services/evidenciaServices';
import { getUserInfo } from '../services/loginServices';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import LaudoModal from "../components/LaudoModal";
import { generateEvidenceReport, saveEvidenceReport } from '../services/laudoModalServices';



function EvidenciaScreen({ navigation, route }) {
  const { caseId, filterByCase } = route.params || {};
  const [nome, setNome] = useState('');
  const [dataFato, setDataFato] = useState('');
  const [tipoExame, setTipoExame] = useState('');
  const [image, setImagem] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [location, setLocation] = useState(null);
  const [evidences, setEvidences] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editEvidenceId, setEditEvidenceId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showExameMenu, setShowExameMenu] = useState(false);

  const exameOptions = [
    'Exame odontolegal comparativo',
    'Exame antropológico',
    'Exame radiológico',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Usuário não autenticado.');
        }

        const [evidencesData, casesData] = await Promise.all([
          fetchEvidences(token),
          fetchCases(token),
        ]);

        const filteredEvidences = filterByCase
          ? evidencesData.filter((e) => e.caseId === caseId)
          : evidencesData;

        setEvidences(filteredEvidences);
        setCases(casesData);
        setError('');
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [caseId, filterByCase]);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Permissão para acessar a câmera negada!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }], // Corrigido erro de sintaxe
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImagem({ uri: manipulatedImage.uri });

      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        setImageBase64(base64Data);
      };
      reader.readAsDataURL(blob);
    }
  }, []);

  const requestLocationPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permissão de localização negada');
      return null;
    }

    const loc = await Location.getCurrentPositionAsync({});
    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
  }, []);

  const handleSave = useCallback(async () => {
    if (!nome || !dataFato || !tipoExame || !imageBase64) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios e capture uma imagem.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Usuário não autenticado.');
      }

      const locationData = await requestLocationPermission();
      const evidenceData = {
        type: 'IMAGE', // Garantido como maiúsculo
        dateCollection: new Date(dataFato).toISOString(),
        caseId: caseId || cases[0]?.id,
        imageBase64,
        latitude: locationData?.latitude || null,
        longitude: locationData?.longitude || null,
        nome,
        tipoExames: tipoExame,
      };

      console.log('Enviando evidência:', JSON.stringify(evidenceData, null, 2));

      let updatedEvidences;
      if (editEvidenceId) {
        await updateEvidence(
          token,
          editEvidenceId,
          evidenceData.type,
          evidenceData.dateCollection,
          evidenceData.caseId,
          evidenceData.imageBase64,
          evidenceData.latitude,
          evidenceData.longitude,
          evidenceData.nome,
          evidenceData.tipoExames
        );
        updatedEvidences = evidences.map((e) =>
          e.id === editEvidenceId ? { ...e, ...evidenceData } : e
        );
        Alert.alert('Sucesso', 'Evidência atualizada com sucesso!');
      } else {
        const newEvidence = await createEvidence(
          token,
          evidenceData.type,
          evidenceData.dateCollection,
          evidenceData.caseId,
          evidenceData.imageBase64,
          evidenceData.latitude,
          evidenceData.longitude,
          evidenceData.nome,
          evidenceData.tipoExames
        );
        updatedEvidences = [...evidences, newEvidence];
        Alert.alert('Sucesso', 'Evidência cadastrada com sucesso!');
      }

      setEvidences(updatedEvidences);
      resetForm();
    } catch (err) {
      setError(err.message || 'Erro ao salvar evidência');
      Alert.alert('Erro', err.message || 'Erro ao salvar evidência');
    } finally {
      setLoading(false);
    }
  }, [nome, dataFato, tipoExame, imageBase64, caseId, cases, editEvidenceId, evidences, resetForm]);

  const resetForm = useCallback(() => {
    setNome('');
    setDataFato('');
    setTipoExame('');
    setImagem(null);
    setImageBase64(null);
    setEditEvidenceId(null);
    setError('');
  }, []);

  const parseContent = useCallback((content) => {
    if (!content) return {};
    try {
      return JSON.parse(content);
    } catch (e) {
      console.warn('Erro ao parsear content:', e);
      return {};
    }
  }, []);

  const handleEditEvidence = useCallback((evidence) => {
    const contentData = parseContent(evidence.content);
    setEditEvidenceId(evidence.id);
    setNome(contentData.nome || '');
    setDataFato(new Date(evidence.dateCollection).toISOString().split('T')[0]);
    setTipoExame(contentData.tipoExames || '');
    setImagem(evidence.imageURL ? { uri: evidence.imageURL } : null);
    setImageBase64(evidence.imageURL || null);
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
              const token = await AsyncStorage.getItem('accessToken');
              await deleteEvidence(token, evidenceId);
              setEvidences(evidences.filter((e) => e.id !== evidenceId));
              Alert.alert('Sucesso', 'Evidência desativada com sucesso!');
            } catch (err) {
              setError(err.message || 'Erro ao excluir evidência');
              Alert.alert('Erro', err.message || 'Erro ao excluir evidência');
            }
          },
        },
      ]
    );
  }, [evidences]);

  const handleViewEvidence = useCallback((evidence) => {
    setSelectedEvidence(evidence);
    setModalVisible(true);
  }, []);

  const handleGenerateReport = useCallback(async (evidence, caseInfo) => {
    try {
      setLoading(true);
      const report = await generateEvidenceReport(evidence, caseInfo);
      return report;
    } catch (err) {
      throw new Error(err.message || 'Erro ao gerar laudo');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownloadPDF = useCallback(async (reportContent, evidenceId) => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; }
              .section { margin-bottom: 20px; }
              .section-title { font-weight: bold; font-size: 18px; }
              .content { font-size: 14px; white-space: pre-wrap; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            <h1>Laudo Pericial - Evidência ${evidenceId}</h1>
            ${imageBase64 ? `<img src="data:image/jpeg;base64,${imageBase64}" />` : ''}
            <div class="section">
              <div class="section-title">Conteúdo do Laudo</div>
              <div class="content">${reportContent.replace(/\n/g, '<br>')}</div>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Baixar Laudo em PDF',
        UTI: 'com.adobe.pdf',
      });
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      Alert.alert('Erro', 'Erro ao gerar ou compartilhar PDF');
    }
  }, [imageBase64]);

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

  const renderForm = useCallback(() => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>
        {editEvidenceId ? 'Editar Evidência' : 'Cadastrar Evidência'}
      </Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TextInput
        label="Nome*"
        value={nome}
        onChangeText={setNome}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Data do Fato* (YYYY-MM-DD)"
        value={dataFato}
        onChangeText={setDataFato}
        mode="outlined"
        style={styles.input}
        placeholder="2025-06-12"
      />
      <Menu
        visible={showExameMenu}
        onDismiss={() => setShowExameMenu(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setShowExameMenu(true)}
            style={styles.menuInput}
          >
            <Text>{tipoExame || 'Selecionar Tipo de Exame*'}</Text>
          </TouchableOpacity>
        }
      >
        {exameOptions.map((option) => (
          <Menu.Item
            key={option}
            onPress={() => {
              setTipoExame(option);
              setShowExameMenu(false);
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
        disabled={loading}
      >
        Capturar Imagem
      </Button>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.previewImage}
        />
      )}
      <Button
        icon="content-save"
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        disabled={loading}
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
  ), [error, nome, dataFato, tipoExame, image, editEvidenceId, loading, pickImage, handleSave, resetForm, showExameMenu]);

  const renderEvidenceRow = useCallback(({ item }) => {
    const contentData = parseContent(item.content);
    return (
      <View style={styles.evidenceRow}>
        <View style={styles.evidenceInfo}>
          <Text style={styles.evidenceCodeText}>{item.id}</Text>
          <Text style={styles.evidenceNameText}>{contentData.nome || 'Sem nome'}</Text>
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
          <TouchableOpacity
            onPress={() => handleViewEvidence(item)}
            style={styles.actionButton}
          >
            <MaterialIcons name="file-document" size={20} color="#4caf50" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [getStatusStyle, handleViewEvidence, handleEditEvidence, handleDeleteEvidence, parseContent]);

  if (loading && !evidences.length) {
    return (
      <View style={styles.viewContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.viewContainer}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Gerenciar Evidências" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderForm()}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Evidências Cadastradas</Text>
          <FlatList
            data={evidences}
            renderItem={renderEvidenceRow}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma evidência cadastrada</Text>}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      <LaudoModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        evidence={selectedEvidence}
        caseInfo={cases.find((c) => c.id === selectedEvidence?.caseId) || {}}
        onGenerateReport={handleGenerateReport}
        onDownloadPDF={handleDownloadPDF}
        loading={loading}
        imageBase64={imageBase64}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 5,
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
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
});

export default EvidenciaScreen;