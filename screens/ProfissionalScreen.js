import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { Appbar, Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/stylesProfissionais';
import stylesCases from '../styles/stylesCases';
import {fetchProfessionals,createProfessional,updateProfessional,deleteProfessional,} from "../services/profissionaisServices";



function ProfessionalScreen({ navigation }) {
  const [userName, setUserName] = useState('Julia');
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSexModal, setShowSexModal] = useState(false);
  const [showAccessLevelModal, setShowAccessLevelModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const sexOptions = ['Masculino', 'Feminino', 'Não informado'];
  const accessLevelOptions = ['Administrador', 'Perito', 'Assistente de Perito'];

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    birthDate: '',
    sex: '',
    accessLevel: '',
  });

  const [birthDateDisplay, setBirthDateDisplay] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userInfo = await AsyncStorage.getItem('userInfo');
        setUserName(JSON.parse(userInfo)?.name || 'Julia');

        const data = await fetchProfessionals();
        setProfessionals(data);
        setFilteredProfessionals(data);
      } catch (error) {
        Alert.alert('Erro', error.message || 'Falha ao carregar profissionais');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProfessionals(professionals);
    } else {
      const filtered = professionals.filter(p =>
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.id && p.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.accessLevel && p.accessLevel.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProfessionals(filtered);
    }
  }, [searchQuery, professionals]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userInfo');
      navigation.navigate('Auth');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao realizar logout');
    }
  };

  const handleSaveProfessional = async () => {
    try {
      const professionalData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accessLevel: formData.accessLevel,
      };

      if (editingProfessional) {
        const updated = await updateProfessional(editingProfessional.id, professionalData);
        const updatedProfessionals = professionals.map(p =>
          p.id === editingProfessional.id ? updated : p
        );
        setProfessionals(updatedProfessionals);
        setFilteredProfessionals(updatedProfessionals);
        setEditingProfessional(null);
        setShowEditModal(false);
        Alert.alert('Sucesso', 'Profissional atualizado com sucesso!');
      } else {
        const newProfessional = await createProfessional(
          professionalData.name,
          professionalData.email,
          professionalData.password,
          professionalData.accessLevel
        );
        setProfessionals([...professionals, newProfessional]);
        setFilteredProfessionals([...professionals, newProfessional]);
        Alert.alert('Sucesso', 'Profissional cadastrado com sucesso!');
      }
      resetForm();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao salvar profissional');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      password: '',
      birthDate: '',
      sex: '',
      accessLevel: '',
    });
    setBirthDateDisplay('');
  };

  const handleViewProfessional = (p) => {
    setSelectedProfessional(p);
    setShowViewModal(true);
  };

  const handleEditProfessional = (p) => {
    setEditingProfessional(p);
    setFormData({
      id: p.id || '',
      name: p.name || '',
      email: p.email || '',
      password: p.password || '',
      birthDate: p.birthDate || '',
      sex: p.sex || '',
      accessLevel: p.accessLevel || '',
    });
    setBirthDateDisplay(formatDateToBrazilian(p.birthDate));
    setShowEditModal(true);
  };

  const handleDeleteProfessional = (professionalId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este profissional?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfessional(professionalId);
              const updatedProfessionals = professionals.filter(p => p.id !== professionalId);
              setProfessionals(updatedProfessionals);
              setFilteredProfessionals(updatedProfessionals);
              Alert.alert('Sucesso', 'Profissional excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', error.message || 'Falha ao excluir profissional');
            }
          }
        }
      ]
    );
  };

  const formatDateToBrazilian = (dateString) => {
    if (!dateString || dateString === 'Não informado') return '';
    if (dateString.includes('/') && dateString.length === 10) return dateString;
    if (dateString.includes('-') && dateString.length === 10) {
      const parts = dateString.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  const convertBrazilianToISO = (brazilianDate) => {
    if (!brazilianDate || brazilianDate.length !== 10) return '';
    const parts = brazilianDate.split('/');
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      if (parseInt(day) > 0 && parseInt(day) <= 31 &&
          parseInt(month) > 0 && parseInt(month) <= 12 &&
          parseInt(year) > 1900 && parseInt(year) <= new Date().getFullYear()) {
        return `${year}-${month}-${day}`;
      }
    }
    return '';
  };

  const formatDateInput = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  };

  const handleDateChange = (text) => {
    const formattedText = formatDateInput(text);
    setBirthDateDisplay(formattedText);
    if (formattedText.length === 10) {
      const isoDate = convertBrazilianToISO(formattedText);
      if (isoDate) setFormData({ ...formData, birthDate: isoDate });
    } else {
      setFormData({ ...formData, birthDate: formattedText });
    }
  };

  const renderProfessionalRow = (p, index) => (
    <View key={index} style={styles.professionalRow}>
      <View style={styles.professionalInfo}>
        <Text style={styles.professionalCode}>{p.id}</Text>
        <Text style={styles.professionalName}>{p.name}</Text>
        <Text style={styles.professionalEmail}>{p.email}</Text>
        <Text style={styles.professionalAccessLevel}>{p.accessLevel}</Text>
      </View>
      <View style={styles.professionalActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditProfessional(p)}
        >
          <MaterialIcons name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleViewProfessional(p)}
        >
          <MaterialIcons name="visibility" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteProfessional(p.id)}
        >
          <MaterialIcons name="close" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
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
            placeholder="Pesquisar profissionais"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            mode="outlined"
            dense
          />

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editingProfessional ? 'Editar Profissional' : 'Cadastrar Profissional'}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome*</Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                style={styles.textInput}
                mode="outlined"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email*</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                style={styles.textInput}
                mode="outlined"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha*</Text>
              <TextInput
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                style={styles.textInput}
                mode="outlined"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Data de Nascimento (DD/MM/AAAA)</Text>
              <TextInput
                value={birthDateDisplay}
                onChangeText={handleDateChange}
                style={styles.textInput}
                mode="outlined"
                placeholder="DD/MM/AAAA"
                maxLength={10}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sexo</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setShowSexModal(true)}
              >
                <Text style={styles.pickerText}>{formData.sex || 'Selecionar sexo'}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nível de Acesso*</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setShowAccessLevelModal(true)}
              >
                <Text style={styles.pickerText}>{formData.accessLevel || 'Selecionar nível'}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Button
              mode="contained"
              onPress={handleSaveProfessional}
              style={styles.saveButton}
              labelStyle={styles.saveButtonText}
            >
              {editingProfessional ? 'Atualizar' : 'Salvar'}
            </Button>

            {editingProfessional && (
              <Button
                mode="outlined"
                onPress={() => {
                  setEditingProfessional(null);
                  setShowEditModal(false);
                  resetForm();
                }}
                style={[styles.saveButton, { marginTop: 10 }]}
              >
                Cancelar
              </Button>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Profissionais</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerText}>Código</Text>
                  <Text style={styles.headerText}>Nome</Text>
                  <Text style={styles.headerText}>Email</Text>
                  <Text style={styles.headerText}>Nível de Acesso</Text>
                  <Text style={styles.headerText}>Ações</Text>
                </View>
                {filteredProfessionals.map(renderProfessionalRow)}
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

        {/* Modal para seleção de sexo */}
        <Modal
          transparent={true}
          visible={showSexModal}
          animationType="fade"
          onRequestClose={() => setShowSexModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowSexModal(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecionar Sexo</Text>
              {sexOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setFormData({ ...formData, sex: option });
                    setShowSexModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal para seleção de nível de acesso */}
        <Modal
          transparent={true}
          visible={showAccessLevelModal}
          animationType="fade"
          onRequestClose={() => setShowAccessLevelModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowAccessLevelModal(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecionar Nível de Acesso</Text>
              {accessLevelOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setFormData({ ...formData, accessLevel: option });
                    setShowAccessLevelModal(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal para visualização de profissional */}
        <Modal
          transparent={true}
          visible={showViewModal}
          animationType="slide"
          onRequestClose={() => setShowViewModal(false)}
        >
          <View style={styles.viewModalOverlay}>
            <View style={styles.viewModalContent}>
              <View style={styles.viewModalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowViewModal(false)}
                >
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {selectedProfessional && (
                <ScrollView style={styles.viewModalBody}>
                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Código</Text>
                    <View style={styles.detailValueContainer}>
                      <MaterialIcons name="check-box" size={16} color="#4CAF50" />
                      <Text style={styles.detailValue}>{selectedProfessional.id}</Text>
                    </View>
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Nome</Text>
                    <Text style={styles.detailValue}>{selectedProfessional.name}</Text>
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{selectedProfessional.email}</Text>
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Data de Nascimento</Text>
                    <Text style={styles.detailValue}>{formatDateToBrazilian(selectedProfessional.birthDate)}</Text>
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Sexo</Text>
                    <Text style={styles.detailValue}>{selectedProfessional.sex}</Text>
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Nível de Acesso</Text>
                    <Text style={styles.detailValue}>{selectedProfessional.accessLevel}</Text>
                  </View>

                  <View style={styles.modalActions}>
                    <Text style={styles.actionsTitle}>Ações</Text>
                    <View style={styles.actionButtons}>
                     <Text style={styles.actionBtn}></Text>
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => {
                            handleEditProfessional(selectedProfessional);
                            setShowViewModal(false);
                          }}
                        >
                          <MaterialIcons name="edit" size={20} color="#4CAF50" />
                        </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {
                          handleDeleteProfessional(selectedProfessional.id);
                          setShowViewModal(false);
                        }}
                      >
                        <MaterialIcons name="close" size={20} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.saveModalButton}
                    onPress={() => setShowViewModal(false)}
                  >
                    <Text style={styles.saveModalButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={showEditModal}
          animationType="slide"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.viewModalOverlay}>
            <View style={styles.viewModalContent}>
              <View style={styles.viewModalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setShowEditModal(false);
                    setEditingProfessional(null);
                    resetForm();
                  }}
                >
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {editingProfessional && (
                <ScrollView style={styles.viewModalBody}>
                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Código</Text>
                    <View style={styles.detailValueContainer}>
                      <MaterialIcons name="check-box" size={16} color="#666" />
                      <TextInput
                        value={formData.id}
                        onChangeText={(text) => setFormData({ ...formData, id: text })}
                        style={styles.editInput}
                        mode="outlined"
                        disabled
                      />
                    </View>
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Nome</Text>
                    <TextInput
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      style={styles.editInput}
                      mode="outlined"
                    />
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <TextInput
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      style={styles.editInput}
                      mode="outlined"
                      keyboardType="email-address"
                    />
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Senha</Text>
                    <TextInput
                      value={formData.password}
                      onChangeText={(text) => setFormData({ ...formData, password: text })}
                      style={styles.editInput}
                      mode="outlined"
                      secureTextEntry
                    />
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Data de Nascimento</Text>
                    <TextInput
                      value={birthDateDisplay}
                      onChangeText={handleDateChange}
                      style={styles.editInput}
                      mode="outlined"
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Sexo</Text>
                    <TouchableOpacity
                      style={styles.pickerContainer}
                      onPress={() => setShowSexModal(true)}
                    >
                      <Text style={styles.pickerText}>{formData.sex || 'Selecionar sexo'}</Text>
                      <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.professionalDetailRow}>
                    <Text style={styles.detailLabel}>Nível de Acesso</Text>
                    <TouchableOpacity
                      style={styles.pickerContainer}
                      onPress={() => setShowAccessLevelModal(true)}
                    >
                      <Text style={styles.pickerText}>{formData.accessLevel || 'Selecionar nível'}</Text>
                      <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.saveModalButton}
                    onPress={handleSaveProfessional}
                  >
                    <Text style={styles.saveModalButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
}

export default ProfessionalScreen;
