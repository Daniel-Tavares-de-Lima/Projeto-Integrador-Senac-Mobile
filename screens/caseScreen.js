
import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, TouchableOpacity, Alert, Modal } from "react-native";
import { Appbar, Button, TextInput, Menu, Divider, HelperText, TouchableRipple, Portal } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/stylesHome";
import stylesCases from "../styles/stylesCases";
import stylesVictims from "../styles/stylesVitima";
import { fetchCases, createCase, updateCase, deleteCase } from '../services/casosServices';
import { fetchVictims } from '../services/vitimaServices';
import { apiRequest } from '../services/apiService';
import * as DocumentPicker from 'expo-document-picker';

import { StyleSheet } from 'react-native';

function CasesScreen({ navigation }) {
  const [especificacao, setEspecificacao] = useState("");
  const [Pesquisar, setPesquisar] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataFato, setDataFato] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [victims, setVictims] = useState([]);
  const [peritos, setPeritos] = useState([]);
  const [selectedVictims, setSelectedVictims] = useState([]);
  const [showVictimMenu, setShowVictimMenu] = useState(false);
  const [tipoEvidencia, setTipoEvidencia] = useState("");
  const [showTipoEvidencia, setShowTipoEvidencia] = useState(false);
  const [tipoCaso, setTipoCaso] = useState("");
  const [showTipoCaso, setShowTipoCaso] = useState(false);
  const [perito, setPerito] = useState("");
  const [showPerito, setShowPerito] = useState(false);
  const [assistente, setAssistente] = useState("");
  const [showAssistente, setShowAssistente] = useState(false);
  const [statusCase, setStatusCase] = useState("");
  const [showStatusCase, setShowStatusCase] = useState(false);
  const [exame, setExame] = useState("");
  const [showExame, setShowExame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCaseId, setEditCaseId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('Usuário');
  const [selectedCase, setSelectedCase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestedExam, setRequestedExam] = useState("");
  const [showExamMenu, setShowExamMenu] = useState(false);

  const examOptions = [
    'Exame odontolegal comparativo',
    'Exame antropológico',
    'Exame radiológico',
  ];

  const getErrorMessage = useCallback((error) => {
    return error instanceof Error ? error.message : 'Erro desconhecido';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        let parsedUserInfo = {};
        try {
          if (userInfo) parsedUserInfo = JSON.parse(userInfo);
        } catch (parseError) {
          console.error('Erro ao parsear userInfo:', parseError);
          await AsyncStorage.setItem('userInfo', JSON.stringify({}));
        }
        setUserRole(parsedUserInfo?.role || 'UNKNOWN');
        setUserName(parsedUserInfo?.name || 'Usuário');

        const [casesData, victimsData, usersData] = await Promise.all([
          fetchCases(),
          fetchVictims(),
          apiRequest('/users', 'GET', null, true),
        ]);
        setCases(Array.isArray(casesData) ? casesData : []);
        setFilteredCases(Array.isArray(casesData) ? casesData : []);
        setVictims(Array.isArray(victimsData) ? victimsData : []);
        setPeritos(usersData.filter((user) => user.role === 'PERITO'));
        setError(null);
      } catch (error) {
        setError(getErrorMessage(error));
        setCases([]);
        setFilteredCases([]);
        setVictims([]);
        setPeritos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getErrorMessage]);

  const handleEscolherArquivo = useCallback(async () => {
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
  }, []);

  const handleSelectVictim = useCallback((victim) => {
    if (!selectedVictims.find((v) => v.id === victim.id)) {
      setSelectedVictims([...selectedVictims, victim]);
    }
    setShowVictimMenu(false);
  }, [selectedVictims]);

  const handleRemoveVictim = useCallback((victimId) => {
    setSelectedVictims(selectedVictims.filter((v) => v.id !== victimId));
  }, [selectedVictims]);

  const handleSaveCase = useCallback(async () => {
    if (!especificacao || !descricao || !tipoCaso || !perito || !dataFato || selectedVictims.length === 0) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios e selecione pelo menos uma vítima.");
      return;
    }
    if (!["ANDAMENTO", "FINALIZADO", "ARQUIVADO"].includes(statusCase)) {
      Alert.alert("Erro", "Selecione um status válido: Em andamento, Finalizado ou Arquivado.");
      return;
    }
    try {
      const caseData = {
        title: especificacao,
        description: descricao,
        classification: tipoCaso,
        managerId: perito,
        solicitante: assistente || undefined,
        dateFact: dataFato,
        statusCase: statusCase || undefined,
        victims: selectedVictims.map((v) => v.id),
        fileName: arquivo?.name || undefined,
      };
      if (editCaseId) {
        await updateCase(editCaseId, caseData);
        Alert.alert("Sucesso", "Caso atualizado com sucesso!");
        setEditCaseId(null);
      } else {
        await createCase(caseData);
        Alert.alert("Sucesso", "Caso salvo com sucesso!");
      }
      resetForm();
      const casesData = await fetchCases();
      setCases(Array.isArray(casesData) ? casesData : []);
      setFilteredCases(Array.isArray(casesData) ? casesData : []);
    } catch (error) {
      Alert.alert("Erro", getErrorMessage(error));
    }
  }, [especificacao, descricao, tipoCaso, perito, dataFato, statusCase, selectedVictims, arquivo, editCaseId, getErrorMessage]);

  const resetForm = useCallback(() => {
    setEspecificacao("");
    setDescricao("");
    setDataFato("");
    setTipoEvidencia("");
    setTipoCaso("");
    setPerito("");
    setAssistente("");
    setStatusCase("");
    setExame("");
    setArquivo(null);
    setSelectedVictims([]);
    setEditCaseId(null);
  }, []);

  const handleEditCase = useCallback((caseItem) => {
    if (!['ADMIN', 'PERITO'].includes(userRole)) {
      Alert.alert("Erro", "Você não tem permissão para editar casos.");
      return;
    }
    setEditCaseId(caseItem.id);
    setEspecificacao(caseItem.title);
    setDescricao(caseItem.description);
    setDataFato(caseItem.dateFact);
    setTipoEvidencia(caseItem.classification);
    setTipoCaso(caseItem.classification);
    setPerito(caseItem.managerId);
    setAssistente(caseItem.solicitante || "");
    setStatusCase(caseItem.statusCase);
    setArquivo(caseItem.fileName ? { name: caseItem.fileName } : null);
    setSelectedVictims(victims.filter((v) => caseItem.victims?.includes(v.id)));
    setModalVisible(false);
  }, [userRole, victims]);

  const handleDeleteCase = useCallback((caseId) => {
    if (!['ADMIN', 'PERITO'].includes(userRole)) {
      Alert.alert("Erro", "Você não tem permissão para excluir casos.");
      return;
    }
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este caso?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCase(caseId);
              const casesData = await fetchCases();
              setCases(Array.isArray(casesData) ? casesData : []);
              setFilteredCases(Array.isArray(casesData) ? casesData : []);
              Alert.alert("Sucesso", "Caso excluído com sucesso!");
              setModalVisible(false);
            } catch (error) {
              Alert.alert("Erro", getErrorMessage(error));
            }
          },
        },
      ]
    );
  }, [userRole, getErrorMessage]);

  const handleViewCase = useCallback((caseItem) => {
    setSelectedCase(caseItem);
    setModalVisible(true);
  }, []);

  const handleGenerateReport = useCallback(() => {
    if (!selectedCase) return;
    Alert.alert('Sucesso', 'Laudo gerado com sucesso!');
    // O PDF será gerado pelo frontend como um artefato LaTeX
  }, [selectedCase]);

  const handleRequestExam = useCallback(async () => {
    if (!selectedCase || !requestedExam) {
      Alert.alert('Erro', 'Selecione um exame para solicitar.');
      return;
    }
    try {
      const caseData = {
        ...selectedCase,
        content: JSON.stringify({
          ...JSON.parse(selectedCase.content || '{}'),
          requestedExams: [
            ...(JSON.parse(selectedCase.content || '{}').requestedExams || []),
            { exam: requestedExam, date: new Date().toISOString() },
          ],
        }),
      };
      await updateCase(selectedCase.id, caseData);
      Alert.alert('Sucesso', `Exame "${requestedExam}" solicitado com sucesso!`);
      setRequestedExam("");
      setShowExamMenu(false);
      const casesData = await fetchCases();
      setCases(Array.isArray(casesData) ? casesData : []);
      setFilteredCases(Array.isArray(casesData) ? casesData : []);
      setSelectedCase(caseData);
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error));
    }
  }, [selectedCase, requestedExam, getErrorMessage]);

  const handleAddEvidence = useCallback(() => {
    if (!selectedCase) return;
    navigation.navigate('Evidence', { caseId: selectedCase.id });
    setModalVisible(false);
  }, [selectedCase, navigation]);

  const handleViewEvidences = useCallback(() => {
    if (!selectedCase) return;
    navigation.navigate('Evidence', { caseId: selectedCase.id, filterByCase: true });
    setModalVisible(false);
  }, [selectedCase, navigation]);

  const handleSaveDetails = useCallback(async () => {
    if (!selectedCase) return;
    try {
      await updateCase(selectedCase.id, selectedCase);
      Alert.alert('Sucesso', 'Detalhes do caso atualizados com sucesso!');
      const casesData = await fetchCases();
      setCases(Array.isArray(casesData) ? casesData : []);
      setFilteredCases(Array.isArray(casesData) ? casesData : []);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error));
    }
  }, [selectedCase, getErrorMessage]);

  const getStatusStyle = useCallback((status) => {
    switch (status) {
      case "ANDAMENTO":
        return stylesVictims.statusAndamento;
      case "FINALIZADO":
        return stylesVictims.statusFinalizado;
      case "ARQUIVADO":
        return stylesVictims.statusArquivado || stylesVictims.statusDefault;
      default:
        return stylesVictims.statusDefault;
    }
  }, []);

  const renderCaseRow = useCallback((caseItem, index) => (
    <View key={index} style={stylesVictims.patientRow}>
      <View style={stylesVictims.patientInfo}>
        <Text style={stylesVictims.patientCode}>{caseItem.id.slice(0, 4)}</Text>
        <Text style={stylesVictims.patientType}>{caseItem.classification}</Text>
        <Text style={stylesVictims.patientResponsible}>{peritos.find(p => p.id === caseItem.managerId)?.name || '-'}</Text>
        <Text style={stylesVictims.patientResponsible}>{caseItem.victims?.length || 0} vítima(s)</Text>
        <View style={[stylesVictims.statusBadge, getStatusStyle(caseItem.statusCase)]}>
          <Text style={stylesVictims.statusText}>{caseItem.statusCase}</Text>
        </View>
      </View>
      <View style={stylesVictims.patientActions}>
        <TouchableOpacity
          style={stylesVictims.actionButton}
          onPress={() => handleViewCase(caseItem)}
        >
          <MaterialIcons name="visibility" size={20} color="#2196F3" />
        </TouchableOpacity>
        {['ADMIN', 'PERITO'].includes(userRole) && (
          <>
            <TouchableOpacity
              style={stylesVictims.actionButton}
              onPress={() => handleEditCase(caseItem)}
            >
              <MaterialIcons name="edit" size={20} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
              style={stylesVictims.actionButton}
              onPress={() => handleDeleteCase(caseItem.id)}
            >
              <MaterialIcons name="delete" size={20} color="#F44336" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  ), [userRole, peritos, getStatusStyle, handleViewCase, handleEditCase, handleDeleteCase]);

  const renderModal = () => {
    if (!selectedCase) return null;
    const victimDetails = victims
      .filter((v) => selectedCase.victims?.includes(v.id))
      .map((v) => ({ id: v.id, name: v.name, gender: v.gender || '-' }));
    const contentData = JSON.parse(selectedCase.content || '{}');

    return (
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={modalStyles.modalContainer}
        >
          <ScrollView>
            <Text style={modalStyles.modalTitle}>Detalhes do Caso</Text>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>ID:</Text>
              <Text style={modalStyles.value}>{selectedCase.id}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Título:</Text>
              <TextInput
                value={selectedCase.title}
                onChangeText={(text) => setSelectedCase({ ...selectedCase, title: text })}
                mode="outlined"
                style={modalStyles.input}
                disabled={!['ADMIN', 'PERITO'].includes(userRole)}
              />
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Descrição:</Text>
              <TextInput
                value={selectedCase.description}
                onChangeText={(text) => setSelectedCase({ ...selectedCase, description: text })}
                mode="outlined"
                multiline
                style={modalStyles.input}
                disabled={!['ADMIN', 'PERITO'].includes(userRole)}
              />
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Data do Fato:</Text>
              <TextInput
                value={selectedCase.dateFact}
                onChangeText={(text) => setSelectedCase({ ...selectedCase, dateFact: text })}
                mode="outlined"
                style={modalStyles.input}
                placeholder="YYYY-MM-DD"
                disabled={!['ADMIN', 'PERITO'].includes(userRole)}
              />
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Classificação:</Text>
              <Text style={modalStyles.value}>{selectedCase.classification}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Responsável:</Text>
              <Text style={modalStyles.value}>{peritos.find(p => p.id === selectedCase.managerId)?.name || '-'}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Solicitante:</Text>
              <Text style={modalStyles.value}>{selectedCase.solicitante || '-'}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Status:</Text>
              <Text style={modalStyles.value}>{selectedCase.statusCase}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Arquivo:</Text>
              <Text style={modalStyles.value}>{selectedCase.fileName || 'Nenhum'}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Vítimas:</Text>
              {victimDetails.length > 0 ? (
                victimDetails.map((v, index) => (
                  <Text key={index} style={modalStyles.value}>
                    ID: {v.id}, Nome: {v.name}, Gênero: {v.gender}
                  </Text>
                ))
              ) : (
                <Text style={modalStyles.value}>Nenhuma vítima</Text>
              )}
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Exames Solicitados:</Text>
              {contentData.requestedExams?.length > 0 ? (
                contentData.requestedExams.map((exam, index) => (
                  <Text key={index} style={modalStyles.value}>
                    {exam.exam} (Solicitado em: {new Date(exam.date).toLocaleDateString()})
                  </Text>
                ))
              ) : (
                <Text style={modalStyles.value}>Nenhum exame solicitado</Text>
              )}
            </View>

            <View style={modalStyles.buttonContainer}>
              <Button
                mode="contained"
                icon="file-document"
                onPress={handleGenerateReport}
                style={modalStyles.button}
              >
                Gerar Laudo
              </Button>
              <View style={modalStyles.examRequestContainer}>
                <Menu
                  visible={showExamMenu}
                  onDismiss={() => setShowExamMenu(false)}
                  anchor={
                    <TouchableRipple
                      onPress={() => setShowExamMenu(true)}
                      style={modalStyles.menuInput}
                    >
                      <Text>{requestedExam || "Selecionar Exame"}</Text>
                    </TouchableRipple>
                  }
                >
                  {examOptions.map((option) => (
                    <Menu.Item
                      key={option}
                      onPress={() => {
                        setRequestedExam(option);
                        setShowExamMenu(false);
                      }}
                      title={option}
                    />
                  ))}
                </Menu>
                <Button
                  mode="contained"
                  icon="test-tube"
                  onPress={handleRequestExam}
                  style={modalStyles.button}
                >
                  Solicitar Exame
                </Button>
              </View>
              <Button
                mode="contained"
                icon="plus"
                onPress={handleAddEvidence}
                style={modalStyles.button}
              >
                Adicionar Evidência
              </Button>
              <Button
                mode="contained"
                icon="view-list"
                onPress={handleViewEvidences}
                style={modalStyles.button}
              >
                Ver Evidências
              </Button>
              {['ADMIN', 'PERITO'].includes(userRole) && (
                <>
                  <Button
                    mode="contained"
                    icon="edit"
                    onPress={() => handleEditCase(selectedCase)}
                    style={modalStyles.button}
                  >
                    Editar
                  </Button>
                  <Button
                    mode="contained"
                    icon="delete"
                    onPress={() => handleDeleteCase(selectedCase.id)}
                    style={modalStyles.button}
                  >
                    Excluir
                  </Button>
                  <Button
                    mode="contained"
                    icon="content-save"
                    onPress={handleSaveDetails}
                    style={modalStyles.button}
                  >
                    Salvar
                  </Button>
                </>
              )}
              <Button
                mode="outlined"
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
    return <Text style={styles.loading}>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={stylesCases.header}>
        <Appbar.Action
          color="#2d4a78"
          size={35}
          icon="menu"
          onPress={() => navigation.toggleDrawer()}
        />
        <View style={stylesCases.user}>
          <MaterialIcons name="person" size={35} color="#2d4a78" />
          <Text style={styles.userText}>{userName}</Text>
        </View>
      </Appbar.Header>

      <ScrollView style={styles.main}>
        
        {error && <Text style={stylesCases.error}>{error}</Text>}

        <TextInput label="Pesquisar casos ou pacientes" value={Pesquisar} onChangeText={setPesquisar} mode="outlined"style={stylesVictims.inputPesquisar}/>

        <View style={stylesCases.CadastrarCasos}>

          <Text style={stylesCases.title}>{editCaseId ? "Editar Caso" : "Cadastrar Caso"}</Text>

          <TextInput
            label="Título*"
            value={especificacao}
            onChangeText={setEspecificacao}
            mode="outlined"
            style={stylesCases.input}
          />
          <TextInput
            label="Descrição*"
            value={descricao}
            onChangeText={setDescricao}
            mode="outlined"
            multiline
            style={stylesCases.input}
          />
          <TextInput
            label="Data do Fato*"
            value={dataFato}
            onChangeText={setDataFato}
            mode="outlined"
            placeholder="YYYY-MM-DD"
            style={stylesCases.input}
          />
          <Menu
            visible={showTipoEvidencia}
            onDismiss={() => setShowTipoEvidencia(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowTipoEvidencia(true)}
                style={stylesCases.menuInput}
              >
                <Text>{tipoEvidencia || "Tipo de Evidência*"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item
              onPress={() => setTipoEvidencia("Ante mortem")}
              title="Ante mortem"
            />
            <Menu.Item
              onPress={() => setTipoEvidencia("Post mortem")}
              title="Post mortem"
            />
          </Menu>
          <Menu
            visible={showTipoCaso}
            onDismiss={() => setShowTipoCaso(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowTipoCaso(true)}
                style={stylesCases.menuInput}
              >
                <Text>{tipoCaso || "Tipo de Caso*"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setTipoCaso("CRIMINAL")} title="Exame Criminal" />
            <Menu.Item onPress={() => setTipoCaso("ACIDENTE")} title="Acidente" />
            <Menu.Item onPress={() => setTipoCaso("IDENTIFICACAO")} title="Identificação" />
          </Menu>
          <Menu
            visible={showPerito}
            onDismiss={() => setShowPerito(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowPerito(true)}
                style={stylesCases.menuInput}
              >
                <Text>{peritos.find(p => p.id === perito)?.name || "Perito Responsável*"}</Text>
              </TouchableRipple>
            }
          >
            {peritos.map((user) => (
              <Menu.Item
                key={user.id}
                onPress={() => setPerito(user.id)}
                title={user.name}
              />
            ))}
          </Menu>
          <Menu
            visible={showAssistente}
            onDismiss={() => setShowAssistente(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowAssistente(true)}
                style={stylesCases.menuInput}
              >
                <Text>{assistente || "Solicitante"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setAssistente("")} title="Nenhum" />
            <Menu.Item onPress={() => setAssistente("João Assistente")} title="João Assistente" />
          </Menu>
          <Menu
            visible={showStatusCase}
            onDismiss={() => setShowStatusCase(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowStatusCase(true)}
                style={stylesCases.menuInput}
              >
                <Text>{statusCase || "Status*"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setStatusCase("ANDAMENTO")} title="Em andamento" />
            <Menu.Item onPress={() => setStatusCase("FINALIZADO")} title="Finalizado" />
            <Menu.Item onPress={() => setStatusCase("ARQUIVADO")} title="Arquivado" />
          </Menu>
          <Menu
            visible={showVictimMenu}
            onDismiss={() => setShowVictimMenu(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowVictimMenu(true)}
                style={stylesCases.menuInput}
              >
                <Text>{selectedVictims.length > 0 ? `${selectedVictims.length} vítima(s) selecionada(s)` : "Selecionar Vítimas*"}</Text>
              </TouchableRipple>
            }
          >
            {victims.map((victim) => (
              <Menu.Item
                key={victim.id}
                onPress={() => handleSelectVictim(victim)}
                title={`${victim.name} (${victim.id.slice(0, 4)})`}
              />
            ))}
          </Menu>
          {selectedVictims.length > 0 && (
            <View style={stylesCases.selectedVictimsContainer}>
              <Text style={stylesCases.selectedVictimsTitle}>Vítimas Selecionadas:</Text>
              {selectedVictims.map((victim) => (
                <View key={victim.id} style={stylesCases.selectedVictim}>
                  <Text>{`${victim.name} (${victim.id.slice(0, 4)})`}</Text>
                  <TouchableOpacity onPress={() => handleRemoveVictim(victim.id)}>
                    <MaterialIcons name="close" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          <Menu
            visible={showExame}
            onDismiss={() => setShowExame(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowExame(true)}
                style={stylesCases.menuInput}
              >
                <Text>{exame || "Anexar exames"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item
              onPress={() => setExame("Exame odontolegal comparativo")}
              title="Exame odontolegal comparativo"
            />
            <Menu.Item
              onPress={() => setExame("Exame radiográfico")}
              title="Exame radiográfico"
            />
          </Menu>
          <Button
            icon="file"
            mode="outlined"
            onPress={handleEscolherArquivo}
            style={stylesCases.botaoArquivo}
          >
            Escolher arquivo
          </Button>
          {arquivo && <HelperText type="info">{arquivo.name}</HelperText>}
          <Button
            icon="check"
            mode="contained"
            style={stylesCases.botaoSalvar}
            onPress={handleSaveCase}
          >
            {editCaseId ? "Salvar Alterações" : "Salvar"}
          </Button>
          {editCaseId && (
            <Button
              mode="outlined"
              style={stylesCases.botaoCancelar}
              onPress={resetForm}
            >
              Cancelar
            </Button>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Casos Recentes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableContainer}>
              <View style={stylesVictims.tableHeader}>
                <Text style={stylesVictims.headerText}>Código</Text>
                <Text style={stylesVictims.headerText}>Tipo</Text>
                <Text style={stylesVictims.headerText}>Responsável</Text>
                <Text style={stylesVictims.headerText}>Vítimas</Text>
                <Text style={stylesVictims.headerText}>Status</Text>
                <Text style={stylesVictims.headerText}>Ações</Text>
              </View>
              {filteredCases.slice(0, 3).map(renderCaseRow)}
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Todos os Casos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableContainer}>
              <View style={stylesVictims.tableHeader}>
                <Text style={stylesVictims.headerText}>Código</Text>
                <Text style={stylesVictims.headerText}>Tipo</Text>
                <Text style={stylesVictims.headerText}>Responsável</Text>
                <Text style={stylesVictims.headerText}>Vítimas</Text>
                <Text style={stylesVictims.headerText}>Status</Text>
                <Text style={stylesVictims.headerText}>Ações</Text>
              </View>
              {filteredCases.map(renderCaseRow)}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {renderModal()}

      <View style={stylesCases.menuNav}>
        <View style={stylesCases.menuNavi}>
          <MaterialIcons name="home" size={40} color="#2d4a78" />
          <MaterialIcons name="add-circle" size={40} color="#2d4a78" />
          <MaterialIcons name="search" size={40} color="#2d4a78" />
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
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    marginLeft: 20,
    color: '#333',
  },
  detailContainer: {
    marginBottom: 0,
    padding: 10,
    
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  input: {
    marginTop: 5,
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
    minWidth: '45%',
  },
  examRequestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  menuInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});

export default CasesScreen;