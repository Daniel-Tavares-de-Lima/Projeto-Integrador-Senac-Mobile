import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Clipboard,
} from "react-native";
import {
  Appbar,
  Button,
  TextInput,
  Menu,
  Divider,
  HelperText,
  TouchableRipple,
  Portal,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/stylesHome";
import stylesCases from "../styles/stylesCases";
import stylesVictims from "../styles/stylesVitima";
import { updateVictim } from "../services/vitimaServices";
import {
  fetchCases,
  createCase,
  updateCase,
  deleteCase,
} from "../services/casosServices";
import { fetchVictims } from "../services/vitimaServices";
import { apiRequest } from "../services/apiService";
import { generateReport } from "../services/serverServicesIA";
import * as DocumentPicker from "expo-document-picker";
import Markdown from "react-native-markdown-display";

import { StyleSheet } from "react-native";

function CasesScreen({ navigation }) {
  const [especificacao, setEspecificacao] = useState("");
  const [pesquisar, setPesquisar] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataFato, setDataFato] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [victims, setVictims] = useState([]);
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
  const [userName, setUserName] = useState("Usuário");
  const [selectedCase, setSelectedCase] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestedExam, setRequestedExam] = useState("");
  const [showExamMenu, setShowExamMenu] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reports, setReports] = useState([]);
  const [peritos, setPeritos] = useState([]);
  const [isReportExpanded, setIsReportExpanded] = useState(false);

  const examOptions = [
    "Exame odontolegal comparativo",
    "Exame antropológico",
    "Exame radiológico",
  ];

  const getErrorMessage = useCallback((error) => {
    return error instanceof Error ? error.message : "Erro desconhecido";
  }, []);

  const fetchReports = useCallback(
    async (caseId) => {
      try {
        console.log("Buscando relatórios para caseId:", caseId);
        const response = await apiRequest("/reports", "GET", null, true);
        const caseReports = Array.isArray(response)
          ? response.filter((report) => report.caseId === caseId)
          : [];
        setReports(caseReports);
        console.log("Relatórios encontrados:", caseReports);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error("Erro ao buscar relatórios:", errorMessage, error);
        setReports([]);
      }
    },
    [getErrorMessage]
  );

  const handleGenerateReport = useCallback(async () => {
    if (!selectedCase) return;
    setIsGeneratingReport(true);
    setReportError(null);
    try {
      console.log("Gerando relatório para caso ID:", selectedCase.id);
      const victimDetails = victims.filter(
        (v) =>
          selectedCase.vitimas?.includes(v.id) || v.caseId === selectedCase.id
      );
      const report = await generateReport(selectedCase, victimDetails, peritos);
      setReportTitle(report.title);
      setReportContent(report.content);
      setReportModalVisible(true);
      console.log("Relatório gerado:", {
        title: report.title,
        content: report.content,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setReportError(errorMessage);
      Alert.alert("Erro", errorMessage);
      console.error("Erro ao gerar relatório:", errorMessage, error);
    } finally {
      setIsGeneratingReport(false);
    }
  }, [selectedCase, victims, peritos, getErrorMessage]);

  const handleSaveReport = useCallback(async () => {
    if (!selectedCase || !reportTitle || !reportContent) {
      Alert.alert("Erro", "Título ou conteúdo do relatório inválido.");
      return;
    }
    try {
      console.log("Salvando relatório para caseId:", selectedCase.id);
      const reportDto = {
        title: reportTitle,
        content: reportContent,
        caseId: selectedCase.id,
      };
      await apiRequest("/reports", "POST", reportDto, true);
      Alert.alert("Sucesso", "Relatório salvo com sucesso!");
      setReportModalVisible(false);
      fetchReports(selectedCase.id);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setReportError(errorMessage);
      Alert.alert("Erro", errorMessage);
      console.error("Erro ao salvar relatório:", errorMessage, error);
    }
  }, [selectedCase, reportTitle, reportContent, getErrorMessage, fetchReports]);

  const handleCopyReport = useCallback(() => {
    Clipboard.setString(reportContent);
    Alert.alert("Sucesso", "Relatório copiado para a área de transferência!");
  }, [reportContent]);

  const handleViewReport = useCallback((report) => {
    setReportTitle(report.title);
    setReportContent(report.content);
    setReportModalVisible(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Iniciando fetchData em CasesScreen");
        const userInfo = await AsyncStorage.getItem("userInfo");
        let parsedUserInfo = {};
        try {
          if (userInfo) {
            parsedUserInfo = JSON.parse(userInfo);
            console.log("userInfo parseado:", parsedUserInfo);
          } else {
            console.log("Nenhum userInfo encontrado no AsyncStorage");
          }
        } catch (parseError) {
          console.error("Erro ao parsear userInfo:", parseError);
          await AsyncStorage.setItem("userInfo", JSON.stringify({}));
        }
        setUserRole(parsedUserInfo?.role || "UNKNOWN");
        setUserName(parsedUserInfo?.name || "Usuário");

        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          console.error("Token não encontrado. Redirecionando para login.");
          Alert.alert("Sessão expirada", "Faça login novamente.", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
          return;
        }

        console.log("Buscando dados: cases, victims, users");
        const [casesData, victimsData, usersData] = await Promise.all([
          fetchCases().catch((err) => {
            console.error("Erro em fetchCases:", err.message);
            return [];
          }),
          fetchVictims().catch((err) => {
            console.error("Erro em fetchVictims:", err.message);
            return [];
          }),
          apiRequest("/users", "GET", null, true).catch((err) => {
            console.error("Erro em apiRequest /users:", err.message);
            return [];
          }),
        ]);

        console.log("Dados recebidos - Casos:", casesData);
        console.log("Dados recebidos - Vítimas:", victimsData);
        console.log("Dados recebidos - Usuários:", usersData);

        setCases(Array.isArray(casesData) ? casesData : []);
        setFilteredCases(Array.isArray(casesData) ? casesData : []);
        setVictims(Array.isArray(victimsData) ? victimsData : []);
        setPeritos(
          Array.isArray(usersData)
            ? usersData.filter((user) => user.role === "PERITO")
            : []
        );
        setError(null);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
        console.error("Erro em fetchData:", errorMessage, error);
        setCases([]);
        setFilteredCases([]);
        setVictims([]);
        setPeritos([]);
        if (
          errorMessage.includes("Token de autenticação não encontrado") ||
          errorMessage.includes("Não autorizado")
        ) {
          Alert.alert("Sessão expirada", "Faça login novamente.", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
          ]);
        }
      } finally {
        setIsLoading(false);
        console.log("fetchData concluído, isLoading:", false);
      }
    };
    fetchData();
  }, [getErrorMessage, navigation]);

  useEffect(() => {
    console.log("Filtrando casos com pesquisa:", pesquisar);
    const filtered = cases.filter((caseItem) => {
      const victimsInCase = victims.filter(
        (v) => caseItem.vitimas?.includes(v.id) || v.caseId === caseItem.id
      );
      console.log(
        `Caso ${caseItem.id} - Vítimas associadas (vitimas ou caseId):`,
        JSON.stringify(victimsInCase, null, 2)
      );
      return (
        caseItem.title.toLowerCase().includes(pesquisar.toLowerCase()) ||
        caseItem.id.toLowerCase().includes(pesquisar.toLowerCase()) ||
        victimsInCase.some((v) =>
          v.name.toLowerCase().includes(pesquisar.toLowerCase())
        )
      );
    });
    setFilteredCases(filtered);
    console.log("Casos filtrados:", JSON.stringify(filtered, null, 2));
  }, [pesquisar, cases, victims]);

  const handleEscolherArquivo = useCallback(async () => {
    try {
      console.log("Iniciando escolha de arquivo");
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.type === "success") {
        setArquivo({ name: result.name, uri: result.uri });
        Alert.alert("Sucesso", `Arquivo selecionado: ${result.name}`);
        console.log("Arquivo selecionado:", result);
      }
    } catch (err) {
      console.error("Erro ao selecionar documento:", err);
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    }
  }, []);

  const handleSelectVictim = useCallback(
    (victim) => {
      console.log("Selecionando vítima:", JSON.stringify(victim, null, 2));
      if (!selectedVictims.find((v) => v.id === victim.id)) {
        setSelectedVictims([...selectedVictims, victim]);
      }
      setShowVictimMenu(false);
    },
    [selectedVictims]
  );

  const handleRemoveVictim = useCallback(
    (victimId) => {
      console.log("Removendo vítima ID:", victimId);
      setSelectedVictims(selectedVictims.filter((v) => v.id !== victimId));
    },
    [selectedVictims]
  );

  const handleSaveCase = useCallback(async () => {
    if (
      !especificacao ||
      !descricao ||
      !tipoCaso ||
      !perito ||
      !dataFato ||
      selectedVictims.length === 0
    ) {
      Alert.alert(
        "Erro",
        "Preencha todos os campos obrigatórios e selecione pelo menos uma vítima."
      );
      console.log("Erro: Campos obrigatórios não preenchidos", {
        especificacao,
        descricao,
        tipoCaso,
        perito,
        dataFato,
        selectedVictims: JSON.stringify(selectedVictims, null, 2),
      });
      return;
    }
    if (
      statusCase &&
      !["ANDAMENTO", "FINALIZADO", "ARQUIVADO"].includes(statusCase)
    ) {
      Alert.alert(
        "Erro",
        "Selecione um status válido: Em andamento, Finalizado ou Arquivado."
      );
      console.log("Erro: Status inválido:", statusCase);
      return;
    }
    try {
      const vitimas = selectedVictims.map((v) => v.id);
      console.log(
        "Salvando caso com vítimas:",
        JSON.stringify(vitimas, null, 2)
      );
      let caseId;
      if (editCaseId) {
        await updateCase(
          editCaseId,
          especificacao,
          descricao,
          tipoCaso,
          perito,
          assistente,
          dataFato,
          statusCase,
          vitimas
        );
        caseId = editCaseId;
        Alert.alert("Sucesso", "Caso atualizado com sucesso!");
        console.log("Caso atualizado, ID:", editCaseId);
        setEditCaseId(null);
      } else {
        const newCase = await createCase(
          especificacao,
          descricao,
          tipoCaso,
          perito,
          assistente,
          dataFato,
          statusCase,
          vitimas
        );
        caseId = newCase.id;
        Alert.alert("Sucesso", "Caso salvo com sucesso!");
        console.log("Caso criado com sucesso, ID:", caseId);
      }

      for (const victim of selectedVictims) {
        await updateVictim(
          victim.id,
          victim.nic,
          victim.name,
          victim.sex === "M" ? "Masculino" : "Feminino",
          victim.birthDate,
          victim.document,
          victim.address,
          victim.ethnicity,
          victim.odontogramEntries?.[0]?.note || "",
          victim.anatomicalNotes,
          caseId
        );
        console.log(`Vítima ${victim.id} atualizada com caseId: ${caseId}`);
      }

      const [casesData, victimsData] = await Promise.all([
        fetchCases(),
        fetchVictims(),
      ]);
      setCases(Array.isArray(casesData) ? casesData : []);
      setFilteredCases(Array.isArray(casesData) ? casesData : []);
      setVictims(Array.isArray(victimsData) ? victimsData : []);
      console.log(
        "Casos atualizados após salvar:",
        JSON.stringify(casesData, null, 2)
      );
      console.log(
        "Vítimas atualizadas após salvar:",
        JSON.stringify(victimsData, null, 2)
      );

      resetForm();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert("Erro", errorMessage);
      console.error("Erro ao salvar caso:", errorMessage, error);
    }
  }, [
    especificacao,
    descricao,
    tipoCaso,
    perito,
    dataFato,
    statusCase,
    selectedVictims,
    editCaseId,
    getErrorMessage,
  ]);

  const resetForm = useCallback(() => {
    console.log("Resetando formulário");
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

  const handleEditCase = useCallback(
    (caseItem) => {
      console.log(
        "Iniciando edição do caso:",
        JSON.stringify(caseItem, null, 2)
      );
      try {
        setEditCaseId(caseItem.id);
        setEspecificacao(caseItem.title || "");
        setDescricao(caseItem.description || "");
        setDataFato(caseItem.dateFact || "");
        setTipoEvidencia(caseItem.classification || "");
        setTipoCaso(caseItem.classification || "");
        setPerito(caseItem.managerId || "");
        setAssistente(caseItem.solicitante || "");
        setStatusCase(caseItem.statusCase || "");
        setArquivo(caseItem.fileName ? { name: caseItem.fileName } : null);
        const selectedVictimsData = victims.filter(
          (v) => caseItem.vitimas?.includes(v.id) || v.caseId === caseItem.id
        );
        setSelectedVictims(selectedVictimsData);
        console.log(
          "Vítimas selecionadas para edição:",
          JSON.stringify(selectedVictimsData, null, 2)
        );
        setModalVisible(false);
        Alert.alert("Sucesso", "Caso pronto para edição!");
      } catch (error) {
        console.error("Erro ao preparar caso para edição:", error);
        Alert.alert("Erro", "Falha ao preparar o caso para edição.");
      }
    },
    [victims]
  );

  const handleDeleteCase = useCallback(
    (caseId) => {
      console.log("Iniciando exclusão do caso ID:", caseId);
      Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza que deseja desativar este caso?",
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
                Alert.alert("Sucesso", "Caso desativado com sucesso!");
                console.log("Caso excluído, ID:", caseId);
                setModalVisible(false);
              } catch (error) {
                const errorMessage = getErrorMessage(error);
                Alert.alert("Erro", errorMessage);
                console.error("Erro ao excluir caso:", errorMessage, error);
              }
            },
          },
        ]
      );
    },
    [getErrorMessage]
  );

  const handleViewCase = useCallback(
    (caseItem) => {
      console.log("Visualizando caso:", JSON.stringify(caseItem, null, 2));
      setSelectedCase(caseItem);
      setModalVisible(true);
      fetchReports(caseItem.id);
      setReportContent("");
      setIsReportExpanded(false);
    },
    [fetchReports]
  );

  const handleRequestExam = useCallback(async () => {
    if (!selectedCase || !requestedExam) {
      Alert.alert("Erro", "Selecione um exame para solicitar.");
      console.log("Erro: Exame não selecionado ou caso inválido");
      return;
    }
    try {
      console.log(
        "Solicitando exame:",
        requestedExam,
        "para caso ID:",
        selectedCase.id
      );
      const content = JSON.parse(selectedCase.content || "{}");
      const updatedContent = {
        ...content,
        requestedExams: [
          ...(content.requestedExams || []),
          { exam: requestedExam, date: new Date().toISOString() },
        ],
      };
      await updateCase(
        selectedCase.id,
        selectedCase.title,
        selectedCase.description,
        selectedCase.classification,
        selectedCase.managerId,
        selectedCase.solicitante,
        selectedCase.dateFact,
        selectedCase.statusCase,
        selectedCase.vitimas,
        JSON.stringify(updatedContent)
      );
      Alert.alert(
        "Sucesso",
        `Exame "${requestedExam}" solicitado com sucesso!`
      );
      setRequestedExam("");
      setShowExamMenu(false);
      const casesData = await fetchCases();
      setCases(Array.isArray(casesData) ? casesData : []);
      setFilteredCases(Array.isArray(casesData) ? casesData : []);
      setSelectedCase({
        ...selectedCase,
        content: JSON.stringify(updatedContent),
      });
      console.log("Exame solicitado e caso atualizado:", selectedCase.id);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert("Erro", errorMessage);
      console.error("Erro ao solicitar exame:", errorMessage, error);
    }
  }, [selectedCase, requestedExam, getErrorMessage]);

  const handleAddEvidence = useCallback(() => {
    if (!selectedCase) return;
    console.log("Navegando para Evidencia, caseId:", selectedCase.id);
    navigation.navigate("Evidencia", { caseId: selectedCase.id });
    setModalVisible(false);
  }, [selectedCase, navigation]);

  const handleViewEvidences = useCallback(() => {
    if (!selectedCase) return;
    console.log(
      "Navegando para Evidencia com filtro, caseId:",
      selectedCase.id
    );
    navigation.navigate("Evidencia", {
      caseId: selectedCase.id,
      filterByCase: true,
    });
    setModalVisible(false);
  }, [selectedCase, navigation]);

  const handleSaveDetails = useCallback(async () => {
    if (!selectedCase) return;
    try {
      console.log("Salvando detalhes do caso ID:", selectedCase.id);
      await updateCase(
        selectedCase.id,
        selectedCase.title,
        selectedCase.description,
        selectedCase.classification,
        selectedCase.managerId,
        selectedCase.solicitante,
        selectedCase.dateFact,
        selectedCase.statusCase,
        selectedCase.vitimas
      );
      Alert.alert("Sucesso", "Detalhes do caso atualizados com sucesso!");
      const casesData = await fetchCases();
      setCases(Array.isArray(casesData) ? casesData : []);
      setFilteredCases(Array.isArray(casesData) ? casesData : []);
      setModalVisible(false);
      console.log("Detalhes do caso salvos:", selectedCase.id);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert("Erro", errorMessage);
      console.error("Erro ao salvar detalhes:", errorMessage, error);
    }
  }, [selectedCase, getErrorMessage]);

  const getStatusStyle = useCallback((status) => {
    console.log("Obtendo estilo para status:", status);
    switch (status) {
      case "ANDAMENTO":
        return localStyles.statusBadgeAndamento;
      case "FINALIZADO":
        return localStyles.statusBadgeFinalizado;
      case "ARQUIVADO":
        return localStyles.statusBadgeArquivado;
      default:
        return localStyles.statusBadgeDefault;
    }
  }, []);

  const renderCaseRow = useCallback(
    (caseItem, index) => {
      const victimsByCaseId = victims.filter((v) => v.caseId === caseItem.id);
      const victimCount =
        caseItem.vitimas?.length || victimsByCaseId.length || 0;
      console.log(`Renderizando linha do caso ${caseItem.id}`, {
        vitimasField: caseItem.vitimas,
        victimsByCaseId: JSON.stringify(victimsByCaseId, null, 2),
        victimCount,
      });
      return (
        <View key={index} style={localStyles.caseRow}>
          <Text style={localStyles.cell}>{caseItem.id.slice(0, 4)}</Text>
          <Text style={localStyles.cell}>{caseItem.classification || "-"}</Text>
          <Text style={localStyles.cell}>
            {peritos.find((p) => p.id === caseItem.managerId)?.name || "-"}
          </Text>
          <Text style={localStyles.cell}>{victimCount} vítima(s)</Text>
          <View
            style={[
              localStyles.cell,
              localStyles.statusCell,
              getStatusStyle(caseItem.statusCase),
            ]}
          >
            <Text style={localStyles.statusText}>
              {caseItem.statusCase || "-"}
            </Text>
          </View>
          <View style={[localStyles.cell, localStyles.actionsCell]}>
            <TouchableOpacity
              onPress={() => handleViewCase(caseItem)}
              style={localStyles.actionButton}
            >
              <MaterialIcons name="visibility" size={20} color="#2196f3" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleEditCase(caseItem)}
              style={localStyles.actionButton}
            >
              <MaterialIcons name="edit" size={20} color="#6200ee" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteCase(caseItem.id)}
              style={localStyles.actionButton}
            >
              <MaterialIcons name="delete" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [
      victims,
      peritos,
      getStatusStyle,
      handleViewCase,
      handleEditCase,
      handleDeleteCase,
    ]
  );

  const renderReportModal = () => {
    console.log(
      "Renderizando reportModal, reportModalVisible:",
      reportModalVisible
    );
    if (!reportModalVisible) return null;
    return (
      <Portal>
        <Modal
          visible={reportModalVisible}
          onDismiss={() => setReportModalVisible(false)}
          contentContainerStyle={modalStyles.modalContainer}
        >
          <ScrollView contentContainerStyle={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>Laudo Pericial</Text>
            <Text style={modalStyles.label}>Título:</Text>
            <TextInput
              value={reportTitle}
              onChangeText={setReportTitle}
              mode="outlined"
              style={modalStyles.input}
              theme={{ colors: { primary: "#6200ee" } }}
            />
            <Text style={modalStyles.label}>Conteúdo:</Text>
            <View style={modalStyles.markdownContainer}>
              {reportContent ? (
                <Markdown style={markdownStyles}>{reportContent}</Markdown>
              ) : (
                <Text style={modalStyles.placeholderText}>
                  Nenhum conteúdo disponível
                </Text>
              )}
            </View>
            {reportError && (
              <HelperText type="error" style={modalStyles.errorText}>
                {reportError}
              </HelperText>
            )}
            <View style={modalStyles.buttonContainer}>
              <Button
                mode="contained"
                icon="content-save"
                onPress={handleSaveReport}
                style={modalStyles.button}
                theme={{ colors: { primary: "#6200ee" } }}
              >
                Salvar Laudo
              </Button>
              <Button
                mode="contained"
                icon="content-copy"
                onPress={handleCopyReport}
                style={modalStyles.button}
                theme={{ colors: { primary: "#6200ee" } }}
              >
                Copiar Laudo
              </Button>
              <Button
                mode="outlined"
                onPress={() => setReportModalVisible(false)}
                style={modalStyles.button}
                theme={{ colors: { primary: "#6200ee" } }}
              >
                Fechar
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    );
  };

  const renderModal = () => {
    if (!selectedCase) return null;
    const victimDetails = victims
      .filter(
        (v) =>
          selectedCase.vitimas?.includes(v.id) || v.caseId === selectedCase.id
      )
      .map((v) => ({
        id: v.id,
        name: v.name,
        gender: v.sex === "M" ? "Masculino" : v.sex === "F" ? "Feminino" : "-",
      }));
    const contentData = JSON.parse(selectedCase.content || "{}");
    console.log(
      "Renderizando modal para caso:",
      JSON.stringify(selectedCase, null, 2),
      "vítimas:",
      JSON.stringify(victimDetails, null, 2)
    );

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
              <Text style={modalStyles.value}>{selectedCase.id || "-"}</Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Título:</Text>
              <TextInput
                value={selectedCase.title || ""}
                onChangeText={(text) =>
                  setSelectedCase({ ...selectedCase, title: text })
                }
                mode="outlined"
                style={modalStyles.input}
              />
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Descrição:</Text>
              <TextInput
                value={selectedCase.description || ""}
                onChangeText={(text) =>
                  setSelectedCase({ ...selectedCase, description: text })
                }
                mode="outlined"
                multiline
                style={modalStyles.input}
              />
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Data do Fato:</Text>
              <TextInput
                value={selectedCase.dateFact || ""}
                onChangeText={(text) =>
                  setSelectedCase({ ...selectedCase, dateFact: text })
                }
                mode="outlined"
                style={modalStyles.input}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Classificação:</Text>
              <Text style={modalStyles.value}>
                {selectedCase.classification || "-"}
              </Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Responsável:</Text>
              <Text style={modalStyles.value}>
                {peritos.find((p) => p.id === selectedCase.managerId)?.name ||
                  "-"}
              </Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Solicitante:</Text>
              <Text style={modalStyles.value}>
                {selectedCase.solicitante || "-"}
              </Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Status:</Text>
              <Text style={modalStyles.value}>
                {selectedCase.statusCase || "-"}
              </Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Arquivo:</Text>
              <Text style={modalStyles.value}>
                {selectedCase.fileName || "Nenhum"}
              </Text>
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Vítimas:</Text>
              {victimDetails.length > 0 ? (
                victimDetails.map((v, index) => (
                  <Text key={index} style={modalStyles.value}>
                    ID: {v.id.slice(0, 8)}, Nome: {v.name}, Gênero: {v.gender}
                  </Text>
                ))
              ) : (
                <Text style={modalStyles.value}>Nenhuma</Text>
              )}
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Exames Solicitados:</Text>
              {contentData.requestedExams?.length > 0 ? (
                contentData.requestedExams.map((exam, index) => (
                  <Text key={index} style={modalStyles.value}>
                    {exam.exam} (Solicitado em:{" "}
                    {new Date(exam.date).toLocaleDateString()})
                  </Text>
                ))
              ) : (
                <Text style={modalStyles.value}>Nenhum exame solicitado</Text>
              )}
            </View>
            <View style={modalStyles.detailContainer}>
              <Text style={modalStyles.label}>Relatórios Gerados:</Text>
              {reports.length > 0 ? (
                reports.map((report, index) => (
                  <View key={report.id} style={modalStyles.reportItem}>
                    <Text style={modalStyles.value}>
                      {report.title} (Gerado em:{" "}
                      {new Date(report.createdAt).toLocaleDateString("pt-BR")})
                    </Text>
                    <Button
                      mode="outlined"
                      onPress={() => handleViewReport(report)}
                      style={modalStyles.buttonSmall}
                    >
                      Ver
                    </Button>
                  </View>
                ))
              ) : (
                <Text style={modalStyles.value}>Nenhum relatório gerado</Text>
              )}
            </View>
            <View style={modalStyles.detailContainer}>
              <View style={modalStyles.reportHeader}>
                <Text style={modalStyles.label}>Laudo Gerado:</Text>
                <TouchableOpacity
                  onPress={() => setIsReportExpanded(!isReportExpanded)}
                >
                  <MaterialIcons
                    name={isReportExpanded ? "expand-less" : "expand-more"}
                    size={24}
                    color="#6200ee"
                  />
                </TouchableOpacity>
              </View>
              {isReportExpanded && (
                <View style={modalStyles.markdownContainer}>
                  {reportContent ? (
                    <Markdown style={markdownStyles}>{reportContent}</Markdown>
                  ) : (
                    <Text style={modalStyles.placeholderText}>
                      Nenhum laudo gerado. Clique em "Gerar Laudo" para criar
                      um.
                    </Text>
                  )}
                </View>
              )}
            </View>

            <View style={modalStyles.buttonContainer}>
              <Button
                mode="contained"
                icon="file-document"
                onPress={handleGenerateReport}
                style={modalStyles.button}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? "Gerando Laudo..." : "Gerar Laudo"}
              </Button>
              {reportError && (
                <HelperText type="error" style={modalStyles.errorText}>
                  {reportError}
                </HelperText>
              )}
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
                        console.log("Exame selecionado:", option);
                      }}
                      title={option}
                    />
                  ))}
                </Menu>
                <Button
                  mode="contained"
                  onPress={handleRequestExam}
                  style={modalStyles.button}
                >
                  Solicitar Exame
                </Button>
              </View>
              <View style={modalStyles.menuControles}>
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
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={modalStyles.button}
                >
                  Fechar
                </Button>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    );
  };

  if (isLoading) {
    console.log("Renderizando estado de carregamento");
    return <Text style={styles.loading}>Carregando...</Text>;
  }

  console.log("Renderizando CasesScreen com dados:", {
    cases: JSON.stringify(cases, null, 2),
    victims: JSON.stringify(victims, null, 2),
    userRole,
    userName,
  });

  return (
    <View style={styles.container}>
      <Appbar.Header style={stylesCases.header}>
        <Appbar.Action
          color="#2d4a78"
          size={35}
          icon="menu"
          onPress={() => {
            console.log("Abrindo drawer");
            navigation.toggleDrawer();
          }}
        />
        <View style={stylesCases.user}>
          <MaterialIcons name="person" size={35} color="#2d4a78" />
          <Text style={styles.userText}>{userName}</Text>
        </View>
      </Appbar.Header>

      <ScrollView style={styles.main}>
        {error && (
          <Text style={stylesCases.error}>
            {console.log("Exibindo erro:", error)}
            {error}
          </Text>
        )}

        <TextInput
          label="Pesquisar casos ou pacientes"
          value={pesquisar}
          onChangeText={setPesquisar}
          mode="outlined"
          style={stylesVictims.inputPesquisar}
        />

        <View style={stylesCases.CadastrarCasos}>
          <Text style={stylesCases.title}>
            {editCaseId ? "Editar Caso" : "Cadastrar Caso"}
          </Text>

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
              onPress={() => setTipoEvidencia("Post Mortem")}
              title="Post Mortem"
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
            <Menu.Item
              onPress={() => setTipoCaso("CRIMINAL")}
              title="Exame Criminal"
            />
            <Menu.Item
              onPress={() => setTipoCaso("ACIDENTE")}
              title="Acidente"
            />
            <Menu.Item
              onPress={() => setTipoCaso("IDENTIFICACAO")}
              title="Identificação"
            />
          </Menu>

          <Menu
            visible={showPerito}
            onDismiss={() => setShowPerito(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowPerito(true)}
                style={stylesCases.menuInput}
              >
                <Text>
                  {peritos.find((p) => p.id === perito)?.name ||
                    "Perito Responsável*"}
                </Text>
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
                <Text>{assistente || "Assistente*"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setAssistente("")} title="Nenhum" />
            <Menu.Item
              onPress={() => setAssistente("João Assistente")}
              title="João Assistente"
            />
          </Menu>

          <Menu
            visible={showStatusCase}
            onDismiss={() => setShowStatusCase(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowStatusCase(true)}
                style={stylesCases.menuInput}
              >
                <Text>{statusCase || "Status"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item
              onPress={() => setStatusCase("ANDAMENTO")}
              title="Em andamento"
            />
            <Menu.Item
              onPress={() => setStatusCase("FINALIZADO")}
              title="Finalizado"
            />
            <Menu.Item
              onPress={() => setStatusCase("ARQUIVADO")}
              title="Arquivado"
            />
          </Menu>

          <Menu
            visible={showVictimMenu}
            onDismiss={() => setShowVictimMenu(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setShowVictimMenu(true)}
                style={stylesCases.menuInput}
              >
                <Text>
                  {selectedVictims.length > 0
                    ? `${selectedVictims.length} vítima(s) selecionada(s)`
                    : "Selecionar Vítimas*"}
                </Text>
              </TouchableOpacity>
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
            <View style={stylesCases.sectionVictims}>
              <Text style={stylesCases.sectionVictimsTitle}>
                Vítimas Selecionadas:
              </Text>
              {selectedVictims.map((victim) => (
                <View key={victim.id} style={stylesCases.selectedVictim}>
                  <Text>{`${victim.name} (${victim.id.slice(0, 4)})`}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveVictim(victim.id)}
                  >
                    <MaterialIcons name="close" size={20} color="#f44336" />
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
                <Text>{exame || "Exame"}</Text>
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
          {arquivo && <Text style={stylesCases.infoText}>{arquivo.name}</Text>}

          <Button
            icon="check"
            mode="contained"
            onPress={handleSaveCase}
            style={stylesCases.botaoSalvar}
          >
            {editCaseId ? "Salvar Alterações" : "Salvar"}
          </Button>

          {editCaseId && (
            <Button
              mode="outlined"
              style={stylesCases.botao}
              onPress={resetForm}
            >
              Cancelar
            </Button>
          )}
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Casos Recentes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={localStyles.tableContainer}>
              <View style={localStyles.tableHeader}>
                <Text style={localStyles.headerText}>Código</Text>
                <Text style={localStyles.headerText}>Tipo</Text>
                <Text style={localStyles.headerText}>Responsável</Text>
                <Text style={localStyles.headerText}>Vítimas</Text>
                <Text style={localStyles.headerText}>Status</Text>
                <Text style={localStyles.headerText}>Ações</Text>
              </View>
              {filteredCases.slice(0, 3).map(renderCaseRow)}
            </View>
          </ScrollView>
        </View>

        <View style={localStyles.section}>
          <Text style={localStyles.sectionTitle}>Todos os Casos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={localStyles.tableContainer}>
              <View style={localStyles.tableHeader}>
                <Text style={localStyles.headerText}>Código</Text>
                <Text style={localStyles.headerText}>Tipo</Text>
                <Text style={localStyles.headerText}>Responsável</Text>
                <Text style={localStyles.headerText}>Vítimas</Text>
                <Text style={localStyles.headerText}>Status</Text>
                <Text style={localStyles.headerText}>Ações</Text>
              </View>
              {filteredCases.map(renderCaseRow)}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {renderModal()}
      {renderReportModal()}

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
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    elevation: 5,
    maxHeight: "90%",
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginLeft: 10,
  },
  value: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    marginLeft: 10,
  },
  input: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
  button: {
    margin: 5,
    minWidth: 120,
    borderRadius: 8,
  },
  examRequestContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    marginLeft: 10,
  },
  menuControles: {
    width: "100%",
    marginBottom: 10,
  },
  menuInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  errorText: {
    width: "100%",
    textAlign: "center",
    color: "#d32f2f",
    marginVertical: 10,
  },
  markdownContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  placeholderText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  buttonSmall: {
    marginLeft: 10,
    marginTop: 5,
    width: 80,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
  },
});

const markdownStyles = {
  body: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200ee",
    marginVertical: 10,
  },
  heading2: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginVertical: 8,
  },
  paragraph: {
    marginVertical: 5,
  },
  list_item: {
    marginVertical: 3,
  },
  bullet_list: {
    marginVertical: 5,
  },
  bullet_list_icon: {
    color: "#6200ee",
    fontSize: 14,
  },
  strong: {
    fontWeight: "bold",
  },
  em: {
    fontStyle: "italic",
  },
};

const localStyles = StyleSheet.create({
  section: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  tableContainer: {
    minWidth: 600,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  caseRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 2,
    borderRadius: 6,
    elevation: 1,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    paddingVertical: 5,
  },
  statusCell: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  actionsCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadgeAndamento: {
    backgroundColor: "#4caf50",
  },
  statusBadgeFinalizado: {
    backgroundColor: "#2196f3",
  },
  statusBadgeArquivado: {
    backgroundColor: "#f44336",
  },
  statusBadgeDefault: {
    backgroundColor: "#999",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  actionButton: {
    paddingHorizontal: 10,
  },
});

export default CasesScreen;
