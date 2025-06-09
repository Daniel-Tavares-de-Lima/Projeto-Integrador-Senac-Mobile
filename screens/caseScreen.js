
import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Appbar, Button, TextInput, Menu, Divider, HelperText, TouchableRipple } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/stylesHome";
import stylesCases from "../styles/stylesCases";
import stylesVictims from "../styles/stylesVitima";
// import DocumentPicker from "react-native-document-picker";
// import * as DocumentPicker from 'expo-document-picker';

// Mock de vítimas (reutilizado de VictimsScreen.js)
const mockVictims = [
  {
    id: "V001",
    nic: "NIC001",
    name: "João Silva",
    gender: "Masculino",
    age: "45",
    document: "12345678900",
    address: "Rua das Palmeiras, 123",
    ethnicity: "Pardo",
    odontogram: "Restaurações nos dentes 16 e 27",
    anatomicalNotes: "Cicatriz na região frontal",
    status: "Em andamento",
  },
  {
    id: "V002",
    nic: "NIC002",
    name: "Maria Oliveira",
    gender: "Feminino",
    age: "30",
    document: "98765432100",
    address: "Rua das Palmeiras, 125",
    ethnicity: "Branco",
    odontogram: "Falta do dente 18",
    anatomicalNotes: "Tatuagem no antebraço esquerdo",
    status: "Finalizado",
  },
];

// Mock de casos atualizado para incluir victimIds
const mockCases = [
  {
    id: "1",
    title: "Caso 001",
    classification: "Pericial",
    dateOpened: "2025-01-10",
    solicitante: "Dr. Pedro",
    managerId: "M001",
    statusCase: "ABERTO",
    victimIds: ["V001"],
  },
  {
    id: "2",
    title: "Caso 002",
    classification: "Odontológico",
    dateOpened: "2025-02-20",
    solicitante: "Dra. Ana",
    managerId: "M002",
    statusCase: "FECHADO",
    victimIds: ["V002"],
  },
];

function CasesScreen({ navigation }) {
  const [especificacao, setEspecificacao] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [cases, setCases] = useState(mockCases);
  const [filteredCases, setFilteredCases] = useState(mockCases);
  const [selectedVictims, setSelectedVictims] = useState([]);
  const [showVictimMenu, setShowVictimMenu] = useState(false);

  // States dos selects
  const [tipoEvidencia, setTipoEvidencia] = useState("");
  const [showTipoEvidencia, setShowTipoEvidencia] = useState(false);
  const [tipoCaso, setTipoCaso] = useState("");
  const [showTipoCaso, setShowTipoCaso] = useState(false);
  const [perito, setPerito] = useState("");
  const [showPerito, setShowPerito] = useState(false);
  const [assistente, setAssistente] = useState("");
  const [showAssistente, setShowAssistente] = useState(false);
  const [exame, setExame] = useState("");
  const [showExame, setShowExame] = useState(false);

  const handleEscolherArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled) {
        setArquivo(result.assets[0]);
      }
    } catch (err) {
      console.log("Erro ao escolher arquivo:", err);
    }
  };


//   const pickFile = async () => {
//   const result = await DocumentPicker.getDocumentAsync({});
//   if (result.type === 'success') {
//     setArquivo(result.assets[0]);   // ou result.uri na SDK < 49
//   }
// };

  const handleSelectVictim = (victim) => {
    if (!selectedVictims.find((v) => v.id === victim.id)) {
      setSelectedVictims([...selectedVictims, victim]);
    }
    setShowVictimMenu(false);
  };

  const handleRemoveVictim = (victimId) => {
    setSelectedVictims(selectedVictims.filter((v) => v.id !== victimId));
  };

  const handleSaveCase = () => {
    if (!especificacao || !tipoEvidencia || !tipoCaso || !perito || selectedVictims.length === 0) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios e selecione pelo menos uma vítima.");
      return;
    }
    const newCase = {
      id: String(cases.length + 1),
      title: especificacao,
      classification: tipoCaso,
      dateOpened: new Date().toISOString().split("T")[0],
      solicitante: assistente || "-",
      managerId: perito,
      statusCase: "ABERTO",
      victimIds: selectedVictims.map((v) => v.id),
    };
    setCases([...cases, newCase]);
    setFilteredCases([...cases, newCase]);
    Alert.alert("Sucesso", "Caso salvo com sucesso!");
    resetForm();
  };

  const resetForm = () => {
    setEspecificacao("");
    setTipoEvidencia("");
    setTipoCaso("");
    setPerito("");
    setAssistente("");
    setExame("");
    setArquivo(null);
    setSelectedVictims([]);
  };

  const handleEditCase = (caseItem) => {
    setEspecificacao(caseItem.title);
    setTipoEvidencia(caseItem.classification);
    setTipoCaso(caseItem.classification);
    setPerito(caseItem.managerId);
    setAssistente(caseItem.solicitante);
    setSelectedVictims(mockVictims.filter((v) => caseItem.victimIds.includes(v.id)));
  };

  const handleDeleteCase = (caseId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este caso?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const updatedCases = cases.filter((c) => c.id !== caseId);
            setCases(updatedCases);
            setFilteredCases(updatedCases);
            Alert.alert("Sucesso", "Caso excluído com sucesso!");
          },
        },
      ]
    );
  };

  const handleViewCase = (caseItem) => {
    const victimDetails = mockVictims
      .filter((v) => caseItem.victimIds.includes(v.id))
      .map((v) => `ID: ${v.id}, Nome: ${v.name}, Gênero: ${v.gender}`)
      .join("\n");
    Alert.alert(
      "Visualizar Caso",
      `ID: ${caseItem.id}\nTítulo: ${caseItem.title}\nClassificação: ${caseItem.classification}\nData: ${caseItem.dateOpened}\nSolicitante: ${caseItem.solicitante}\nResponsável: ${caseItem.managerId}\nStatus: ${caseItem.statusCase}\nVítimas:\n${victimDetails || "Nenhuma vítima"}`
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ABERTO":
        return stylesVictims.statusAndamento;
      case "FECHADO":
        return stylesVictims.statusFinalizado;
      default:
        return stylesVictims.statusDefault;
    }
  };

  const renderCaseRow = (caseItem, index) => (
    <View key={index} style={stylesVictims.patientRow}>
      <View style={stylesVictims.patientInfo}>
        <Text style={stylesVictims.patientCode}>{caseItem.id}</Text>
        <Text style={stylesVictims.patientType}>{caseItem.classification}</Text>
        <Text style={stylesVictims.patientResponsible}>{caseItem.managerId}</Text>
        <Text style={stylesVictims.patientResponsible}>{caseItem.victimIds.length} vítima(s)</Text>
        <View style={[stylesVictims.statusBadge, getStatusStyle(caseItem.statusCase)]}>
          <Text style={stylesVictims.statusText}>{caseItem.statusCase}</Text>
        </View>
      </View>
      <View style={stylesVictims.patientActions}>
        <TouchableOpacity
          style={stylesVictims.actionButton}
          onPress={() => handleEditCase(caseItem)}
        >
          <MaterialIcons name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesVictims.actionButton}
          onPress={() => handleViewCase(caseItem)}
        >
          <MaterialIcons name="visibility" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesVictims.actionButton}
          onPress={() => handleDeleteCase(caseItem.id)}
        >
          <MaterialIcons name="close" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <Text style={styles.userText}>Daniel</Text>
        </View>
      </Appbar.Header>

      <ScrollView style={styles.main}>
        <Text style={styles.title}>Cadastrar Casos</Text>
        <View style={stylesCases.CadastrarCasos}>
          <TextInput
            label="Especificação*"
            value={especificacao}
            onChangeText={setEspecificacao}
            mode="outlined"
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
            <Menu.Item onPress={() => setTipoCaso("Acidente")} title="Acidente" />
            <Menu.Item onPress={() => setTipoCaso("Homicídio")} title="Homicídio" />
          </Menu>
          <Menu
            visible={showPerito}
            onDismiss={() => setShowPerito(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowPerito(true)}
                style={stylesCases.menuInput}
              >
                <Text>{perito || "Perito Responsável*"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setPerito("Julia Maria")} title="Julia Maria" />
            <Menu.Item onPress={() => setPerito("Carlos Silva")} title="Carlos Silva" />
          </Menu>
          <Menu
            visible={showAssistente}
            onDismiss={() => setShowAssistente(false)}
            anchor={
              <TouchableRipple
                onPress={() => setShowAssistente(true)}
                style={stylesCases.menuInput}
              >
                <Text>{assistente || "Atribuir a assistente*"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setAssistente("Nenhum")} title="Nenhum" />
            <Menu.Item
              onPress={() => setAssistente("João Assistente")}
              title="João Assistente"
            />
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
            {mockVictims.map((victim) => (
              <Menu.Item
                key={victim.id}
                onPress={() => handleSelectVictim(victim)}
                title={`${victim.name} (${victim.id})`}
              />
            ))}
          </Menu>
          {selectedVictims.length > 0 && (
            <View style={stylesCases.selectedVictimsContainer}>
              <Text style={stylesCases.selectedVictimsTitle}>Vítimas Selecionadas:</Text>
              {selectedVictims.map((victim) => (
                <View key={victim.id} style={stylesCases.selectedVictim}>
                  <Text>{`${victim.name} (${victim.id})`}</Text>
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
            icon="plus"
            mode="contained"
            style={stylesCases.botaoAdicionar}
            onPress={() => alert("Evidência adicionada")}
          >
            Adicionar evidência
          </Button>
          <Button
            icon="check"
            mode="contained"
            style={stylesCases.botaoSalvar}
            onPress={handleSaveCase}
          >
            Salvar
          </Button>
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

export default CasesScreen;
