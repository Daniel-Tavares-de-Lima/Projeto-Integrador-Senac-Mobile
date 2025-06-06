import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { Appbar, Button, DataTable, TouchableRipple } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/stylesHome";
import stylesCases from "../styles/stylesCases";
//Imports para cadastro de casos
import { TextInput, Menu, Divider, HelperText } from "react-native-paper";

// Mock data (reutilizando os mesmos casos da HomeScreen)
const mockCases = [
  {
    id: "1",
    title: "Caso 001",
    classification: "Pericial",
    dateOpened: "2025-01-10",
    solicitante: "Dr. Pedro",
    managerId: "M001",
    statusCase: "ABERTO",
  },
  {
    id: "2",
    title: "Caso 002",
    classification: "Odontológico",
    dateOpened: "2025-02-20",
    solicitante: "Dra. Ana",
    managerId: "M002",
    statusCase: "FECHADO",
  },
];

function CasesScreen({ navigation }) {
  const [especificacao, setEspecificacao] = useState("");
  const [arquivo, setArquivo] = useState(null);

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
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      setArquivo(result.assets[0]);
    }
  };
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          color="#2d4a78"
          size={30}
          icon="menu"
          onPress={() => navigation.toggleDrawer()}
        />
        {/* <Appbar.Content
          title={
            <Text style={styles.logoApp}>
              Gest<Text style={styles.logoSpan}>Odo</Text>
            </Text>
          }
        /> */}
        <View style={styles.user}>
          <MaterialIcons name="person" size={30} color="#2d4a78" />
          <Text style={styles.userText}>Daniel</Text>
          {/* <Appbar.Action icon="logout" onPress={handleLogout} color="#2d4a78" /> */}
        </View>
      </Appbar.Header>

      <ScrollView style={styles.main}>
        {/*--Cadastrar Casos---*/}
        <Text style={styles.title}>Cadastrar Casos</Text>
        <View style={stylesCases.CadastrarCasos}>
          {/*---Formulário Cadastro---*/}
          <TextInput
            label="Especificação*"
            value={especificacao}
            onChangeText={setEspecificacao}
            mode="outlined"
            style={stylesCases.input}
          />

          {/* Tipo de Evidência */}
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

          {/* Tipo de Caso */}
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
              onPress={() => setTipoCaso("Acidente")}
              title="Acidente"
            />
            <Menu.Item
              onPress={() => setTipoCaso("Homicídio")}
              title="Homicídio"
            />
          </Menu>

          {/* Perito Responsável */}
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
            <Menu.Item
              onPress={() => setPerito("Julia Maria")}
              title="Julia Maria"
            />
            <Menu.Item
              onPress={() => setPerito("Carlos Silva")}
              title="Carlos Silva"
            />
          </Menu>

          {/* Atribuir a assistente */}
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

          {/* Exames */}
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
            onPress={() => alert("Caso salvo!")}
          >
            Salvar
          </Button>
        </View>

        <Text style={styles.title}>Lista de Casos</Text>

        <Text style={styles.sectionTitle}>Casos</Text>
        <ScrollView horizontal>
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title style={styles.tableHeader}>
                Código
              </DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>Tipo</DataTable.Title>


              <DataTable.Title style={styles.tableHeader}>
                Responsável
              </DataTable.Title>

              <DataTable.Title style={styles.tableHeader}>
                Data do Fato
              </DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>
                Local
              </DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>
                Solicitante
              </DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>
                Data do Exame
              </DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>
                Últimos Exames
              </DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>
                Solicitar
              </DataTable.Title>
              <DataTable.Title style={styles.tableHeader}>
                Status
              </DataTable.Title>
            </DataTable.Header>

            {mockCases.length > 0 ? (
              mockCases.map((caso, index) => (
                <DataTable.Row key={caso.id || index}>
                  <DataTable.Cell style={styles.tableCell}>
                    {caso.id ? caso.id.slice(0, 4) : "-"}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>
                    {caso.classification || "-"}
                  </DataTable.Cell>

                   <DataTable.Cell style={styles.tableCell}>
                    {caso.solicitante || "-"}
                  </DataTable.Cell>

                  <DataTable.Cell style={styles.tableCell}>
                    {caso.dateOpened
                      ? new Date(caso.dateOpened).toLocaleDateString()
                      : "-"}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.tableCell}>-</DataTable.Cell>
                 
                  <DataTable.Cell style={styles.tableCell}>
                    {caso.managerId || "-"}
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
                        caso.statusCase === "ABERTO"
                          ? styles.statusAberto
                          : caso.statusCase === "FECHADO"
                          ? styles.statusFechado
                          : styles.statusDefault,
                      ]}
                    >
                      {caso.statusCase || "-"}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell colSpan={10}>
                  Nenhum caso disponível
                </DataTable.Cell>
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

export default CasesScreen;
