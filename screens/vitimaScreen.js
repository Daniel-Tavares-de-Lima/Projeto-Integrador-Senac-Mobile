
import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, Alert } from "react-native";
import { Appbar, Button, TextInput, Menu, Divider, TouchableRipple } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "../styles/stylesHome";
import stylesCases from "../styles/stylesCases";
import stylesVictims from "../styles/stylesVitima";
import DocumentPicker from "react-native-document-picker";

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

function VictimsScreen({ navigation }) {
  const [nic, setNic] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [document, setDocument] = useState("");
  const [address, setAddress] = useState("");
  const [odontogram, setOdontogram] = useState("");
  const [anatomicalNotes, setAnatomicalNotes] = useState("");
  const [gender, setGender] = useState("");
  const [showGender, setShowGender] = useState(false);
  const [ethnicity, setEthnicity] = useState("");
  const [showEthnicity, setShowEthnicity] = useState(false);
  const [victims, setVictims] = useState(mockVictims);
  const [filteredVictims, setFilteredVictims] = useState(mockVictims);
  const [arquivo, setArquivo] = useState(null);


  const handleEscolherArquivo = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) {
      setArquivo(result.assets[0]);
    }
  };

  const handleSaveVictim = () => {
    if (!nic || !name || !gender || !age || !document || !address || !ethnicity) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }
    const newVictim = {
      id: `V${String(victims.length + 1).padStart(3, "0")}`,
      nic,
      name,
      gender,
      age,
      document,
      address,
      ethnicity,
      odontogram: odontogram || "-",
      anatomicalNotes: anatomicalNotes || "-",
      status: "Em andamento",
    };
    setVictims([...victims, newVictim]);
    setFilteredVictims([...victims, newVictim]);
    Alert.alert("Sucesso", "Vítima cadastrada com sucesso!");
    resetForm();
  };

  const resetForm = () => {
    setNic("");
    setName("");
    setGender("");
    setAge("");
    setDocument("");
    setAddress("");
    setEthnicity("");
    setOdontogram("");
    setAnatomicalNotes("");
  };

  const handleEditVictim = (victim) => {
    setNic(victim.nic);
    setName(victim.name);
    setGender(victim.gender);
    setAge(victim.age);
    setDocument(victim.document);
    setAddress(victim.address);
    setEthnicity(victim.ethnicity);
    setOdontogram(victim.odontogram);
    setAnatomicalNotes(victim.anatomicalNotes);
  };

  const handleDeleteVictim = (victimId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta vítima?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const updatedVictims = victims.filter((v) => v.id !== victimId);
            setVictims(updatedVictims);
            setFilteredVictims(updatedVictims);
            Alert.alert("Sucesso", "Vítima excluída com sucesso!");
          },
        },
      ]
    );
  };

  const handleViewVictim = (victim) => {
    Alert.alert("Visualizar Vítima", JSON.stringify(victim, null, 2));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Finalizado":
        return stylesVictims.statusFinalizado;
      case "Em andamento":
        return stylesVictims.statusAndamento;
      case "Arquivado":
        return stylesVictims.statusArquivado;
      default:
        return stylesVictims.statusDefault;
    }
  };

  const renderVictimRow = (victim, index) => (
    <View key={index} style={stylesVictims.patientRow}>
      <View style={stylesVictims.patientInfo}>
        <Text style={stylesVictims.patientCode}>{victim.id}</Text>
        <Text style={stylesVictims.patientType}>{victim.name}</Text>
        <Text style={stylesVictims.patientResponsible}>{victim.gender}</Text>
        <View style={[stylesVictims.statusBadge, getStatusStyle(victim.status)]}>
          <Text style={stylesVictims.statusText}>{victim.status}</Text>
        </View>
      </View>
      <View style={stylesVictims.patientActions}>
        <TouchableOpacity
          style={stylesVictims.actionButton}
          onPress={() => handleEditVictim(victim)}
        >
          <MaterialIcons name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesVictims.actionButton}
          onPress={() => handleViewVictim(victim)}
        >
          <MaterialIcons name="visibility" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesVictims.actionButton}
          onPress={() => handleDeleteVictim(victim.id)}
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
        <Text style={styles.title}>Cadastrar Vítimas</Text>
        <View style={stylesCases.CadastrarCasos}>
          <TextInput
            label="NIC*"
            value={nic}
            onChangeText={setNic}
            mode="outlined"
            style={stylesCases.input}
          />
          <TextInput
            label="Nome*"
            value={name}
            onChangeText={setName}
            mode="outlined"
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
                <Text>{gender || "Gênero*"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setGender("Masculino")} title="Masculino" />
            <Menu.Item onPress={() => setGender("Feminino")} title="Feminino" />
          </Menu>
          <TextInput
            label="Idade*"
            value={age}
            onChangeText={setAge}
            mode="outlined"
            keyboardType="numeric"
            style={stylesCases.input}
          />
          <TextInput
            label="Documento*"
            value={document}
            onChangeText={setDocument}
            mode="outlined"
            style={stylesCases.input}
          />
          <TextInput
            label="Endereço*"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
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
                <Text>{ethnicity || "Cor/Etnia*"}</Text>
              </TouchableRipple>
            }
          >
            <Menu.Item onPress={() => setEthnicity("Preta")} title="Preta" />
            <Menu.Item onPress={() => setEthnicity("Parda")} title="Parda" />
            <Menu.Item onPress={() => setEthnicity("Branca")} title="Branca" />
            <Menu.Item onPress={() => setEthnicity("Amarela")} title="Amarela" />
            <Menu.Item onPress={() => setEthnicity("Indígena")} title="Indígena" />
            <Menu.Item onPress={() => setEthnicity("Não Declarado")} title="Não Declarado" />
          </Menu>
          <TextInput
            label="Odontograma"
            value={odontogram}
            onChangeText={setOdontogram}
            mode="outlined"
            style={stylesCases.input}
            multiline
          />
          <TextInput
            label="Anotações Anatômicas"
            value={anatomicalNotes}
            onChangeText={setAnatomicalNotes}
            mode="outlined"
            style={stylesCases.input}
            multiline
          />

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
            onPress={handleSaveVictim}
          >
            Salvar
          </Button>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Vítimas Recentes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableContainer}>
              <View style={stylesVictims.tableHeader}>
                <Text style={stylesVictims.headerText}>Código</Text>
                <Text style={stylesVictims.headerText}>Nome</Text>
                <Text style={stylesVictims.headerText}>Gênero</Text>
                <Text style={stylesVictims.headerText}>Status</Text>
                <Text style={stylesVictims.headerText}>Ações</Text>
              </View>
              
                {filteredVictims.slice(0, 3).map(renderVictimRow)}
            
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Todas as Vítimas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tableContainer}>
              <View style={stylesVictims.tableHeader}>
                <Text style={stylesVictims.headerText}>Código</Text>
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

export default VictimsScreen;
