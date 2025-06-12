import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { Appbar, Button, TextInput, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/stylesPatients';
import { StyleSheet, Text, View } from 'react-native';


const mockPatients = [
    { id: '022', name: 'Julia Maria', type: 'Acidente', responsible: 'Julia Maria', status: 'Finalizado', sex: 'Feminino', ethnicity: 'Branca', address: 'Rua Santo de Aquino, 123', applicant: 'Carlos Andrade', lastExam: 'Exame odontolegal comparativo' },
    { id: '023', name: 'Ana Maria da Silva', type: 'Acidente', responsible: 'Julia Maria', status: 'Em andamento', sex: 'Feminino', ethnicity: 'Branca', address: 'Rua Santo de Aquino, 456', applicant: 'Carlos Andrade', lastExam: 'Exame odontolegal comparativo' },
    { id: '024', name: 'João Santos', type: 'Acidente', responsible: 'Julia Maria', status: 'Em andamento', sex: 'Masculino', ethnicity: 'Parda', address: 'Rua das Flores, 789', applicant: 'Maria Silva', lastExam: 'Exame radiológico' },
    { id: '025', name: 'Maria Oliveira', type: 'Acidente', responsible: 'Julia Maria', status: 'Em andamento', sex: 'Feminino', ethnicity: 'Preta', address: 'Av. Principal, 321', applicant: 'José Costa', lastExam: 'Exame fotográfico' },
    { id: '026', name: 'Pedro Silva', type: 'Acidente', responsible: 'Julia Maria', status: 'Em andamento', sex: 'Masculino', ethnicity: 'Branca', address: 'Rua do Centro, 654', applicant: 'Ana Lima', lastExam: 'Exame documental' },
    { id: '027', name: 'Carla Souza', type: 'Acidente', responsible: 'Julia Maria', status: 'Finalizado', sex: 'Feminino', ethnicity: 'Amarela', address: 'Rua Nova, 987', applicant: 'Roberto Dias', lastExam: 'Exame pericial' },
    { id: '028', name: 'Lucas Lima', type: 'Acidente', responsible: 'Julia Maria', status: 'Finalizado', sex: 'Masculino', ethnicity: 'Indígena', address: 'Av. Central, 147', applicant: 'Paula Santos', lastExam: 'Exame comparativo' },
    { id: '029', name: 'Fernanda Costa', type: 'Acidente', responsible: 'Julia Maria', status: 'Arquivado', sex: 'Feminino', ethnicity: 'Parda', address: 'Rua Lateral, 258', applicant: 'Marcos Alves', lastExam: 'Exame final' },
];

function PatientScreen({ navigation }) {
    const [userName, setUserName] = useState('Julia');
    const [patients, setPatients] = useState(mockPatients);
    const [filteredPatients, setFilteredPatients] = useState(mockPatients);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSexModal, setShowSexModal] = useState(false);
    const [showEthnicityModal, setShowEthnicityModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [editingPatient, setEditingPatient] = useState(null);

    const sexOptions = ['Masculino', 'Feminino'];
    const ethnicityOptions = ['Preta', 'Parda', 'Branca', 'Amarela', 'Indígena', 'Não Declarar'];

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        sex: '',
        ethnicity: '',
        address: '',
        type: '',
        applicant: '',
        lastExam: '',
        responsible: '',
        birthDate: '',
        examType: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userInfo = await AsyncStorage.getItem('userInfo');
                setUserName(JSON.parse(userInfo)?.name || 'Julia');
            } catch (error) {
                console.log('Erro ao buscar dados do usuário:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter(patient =>
                patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.responsible.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.status.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPatients(filtered);
        }
    }, [searchQuery, patients]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userInfo');
        console.log('Logout realizado');
    };

    const handleSavePatient = () => {
        if (editingPatient) {
            const updatedPatients = patients.map(patient =>
                patient.id === editingPatient.id ? { ...patient, ...formData } : patient
            );
            setPatients(updatedPatients);
            setFilteredPatients(updatedPatients);
            setEditingPatient(null);
            setShowEditModal(false);
            Alert.alert('Sucesso', 'Paciente atualizado com sucesso!');
        } else {
            const newPatient = {
                id: String(Math.max(...patients.map(p => parseInt(p.id))) + 1).padStart(3, '0'),
                name: formData.name,
                type: formData.type || 'Acidente',
                responsible: formData.responsible || 'Julia Maria',
                status: 'Em andamento',
                sex: formData.sex,
                ethnicity: formData.ethnicity,
                address: formData.address,
                applicant: formData.applicant || 'Novo Solicitante',
                lastExam: formData.lastExam || formData.examType
            };
            setPatients([...patients, newPatient]);
            setFilteredPatients([...patients, newPatient]);
            Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
        }
        setShowForm(false);
        setFormData({
            id: '',
            name: '',
            sex: '',
            ethnicity: '',
            address: '',
            type: '',
            applicant: '',
            lastExam: '',
            responsible: '',
            birthDate: '',
            examType: ''
        });
    };

    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
        setShowViewModal(true);
    };

    const handleEditPatient = (patient) => {
        setEditingPatient(patient);
        setFormData({
            id: patient.id || '',
            name: patient.name || '',
            sex: patient.sex || '',
            ethnicity: patient.ethnicity || '',
            address: patient.address || '',
            type: patient.type || '',
            applicant: patient.applicant || '',
            lastExam: patient.lastExam || '',
            responsible: patient.responsible || '',
            birthDate: '',
            examType: patient.lastExam || ''
        });
        setShowEditModal(true);
    };

    const handleDeletePatient = (patientId) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja excluir este paciente?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                        const updatedPatients = patients.filter(patient => patient.id !== patientId);
                        setPatients(updatedPatients);
                        setFilteredPatients(updatedPatients);
                        Alert.alert('Sucesso', 'Paciente excluído com sucesso!');
                    }
                }
            ]
        );
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Finalizado':
                return styles.statusFinalizado;
            case 'Em andamento':
                return styles.statusAndamento;
            case 'Arquivado':
                return styles.statusArquivado;
            default:
                return styles.statusDefault;
        }
    };

    const renderPatientRow = (patient, index) => (
        <View key={index} style={styles.patientRow}>
            <View style={styles.patientInfo}>
                <Text style={styles.patientCode}>{patient.id}</Text>
                <Text style={styles.patientType}>{patient.type}</Text>
                <Text style={styles.patientResponsible}>{patient.responsible}</Text>
                <View style={[styles.statusBadge, getStatusStyle(patient.status)]}>
                    <Text style={styles.statusText}>{patient.status}</Text>
                </View>
            </View>
            <View style={styles.patientActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditPatient(patient)}
                >
                    <MaterialIcons name="edit" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewPatient(patient)}
                >
                    <MaterialIcons name="visibility" size={20} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeletePatient(patient.id)}
                >
                    <MaterialIcons name="close" size={20} color="#F44336" />
                </TouchableOpacity>
            </View>
        </View>
    );

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
                        placeholder="Pesquisar casos ou pacientes"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                        mode="outlined"
                        dense
                    />

                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>
                            {editingPatient ? 'Editar paciente' : 'Cadastrar paciente'}
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
                            <Text style={styles.inputLabel}>Data de Nascimento*</Text>
                            <TextInput
                                value={formData.birthDate}
                                onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
                                style={styles.textInput}
                                mode="outlined"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Sexo*</Text>
                            <TouchableOpacity
                                style={styles.pickerContainer}
                                onPress={() => setShowSexModal(true)}
                            >
                                <Text style={styles.pickerText}>{formData.sex}</Text>
                                <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Endereço*</Text>
                            <View style={styles.addressContainer}>
                                <MaterialIcons name="location-on" size={20} color="#666" style={styles.locationIcon} />
                                <TextInput
                                    value={formData.address}
                                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                                    style={styles.addressInput}
                                    mode="outlined"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Etnia*</Text>
                            <TouchableOpacity
                                style={styles.pickerContainer}
                                onPress={() => setShowEthnicityModal(true)}
                            >
                                <Text style={styles.pickerText}>{formData.ethnicity}</Text>
                                <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Perito Responsável*</Text>
                            <TouchableOpacity style={styles.pickerContainer}>
                                <Text style={styles.pickerText}>{formData.responsible}</Text>
                                <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Anexar exames:</Text>
                            <TouchableOpacity style={styles.pickerContainer}>
                                <Text style={styles.pickerText}>{formData.examType}</Text>
                                <MaterialIcons name="keyboard-arrow-down" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.fileUploadContainer}>
                            <TouchableOpacity style={styles.fileUploadButton}>
                                <Text style={styles.fileUploadText}>Escolher arquivo</Text>
                            </TouchableOpacity>
                            <Text style={styles.fileUploadLabel}>Nenhum arquivo selecionado</Text>
                        </View>

                        <TouchableOpacity style={styles.addEvidenceButton}>
                            <MaterialIcons name="add" size={20} color="#fff" />
                            <Text style={styles.addEvidenceText}>Adicionar evidência</Text>
                        </TouchableOpacity>

                        <Button
                            mode="contained"
                            onPress={handleSavePatient}
                            style={styles.saveButton}
                            labelStyle={styles.saveButtonText}
                        >
                            {editingPatient ? 'Atualizar' : 'Salvar'}
                        </Button>

                        {editingPatient && (
                            <Button
                                mode="outlined"
                                onPress={() => {
                                    setEditingPatient(null);
                                    setShowForm(false);
                                    setFormData({
                                        id: '',
                                        name: '',
                                        sex: '',
                                        ethnicity: '',
                                        address: '',
                                        type: '',
                                        applicant: '',
                                        lastExam: '',
                                        responsible: '',
                                        birthDate: '',
                                        examType: ''
                                    });
                                }}
                                style={[styles.saveButton, { marginTop: 10 }]}
                            >
                                Cancelar
                            </Button>
                        )}
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Pacientes recentes</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.tableContainer}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.headerText}>Código</Text>
                                    <Text style={styles.headerText}>Tipo</Text>
                                    <Text style={styles.headerText}>Responsável</Text>
                                    <Text style={styles.headerText}>Status</Text>
                                    <Text style={styles.headerText}>Ações</Text>
                                </View>
                                {filteredPatients.slice(0, 3).map(renderPatientRow)}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Todos os casos</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.tableContainer}>
                                <View style={styles.tableHeader}>
                                    <Text style={styles.headerText}>Código</Text>
                                    <Text style={styles.headerText}>Tipo</Text>
                                    <Text style={styles.headerText}>Responsável</Text>
                                    <Text style={styles.headerText}>Status</Text>
                                    <Text style={styles.headerText}>Ações</Text>
                                </View>
                                {filteredPatients.map(renderPatientRow)}
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

                            {selectedPatient && (
                                <ScrollView style={styles.viewModalBody}>
                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Código</Text>
                                        <View style={styles.detailValueContainer}>
                                            <MaterialIcons name="check-box" size={16} color="#4CAF50" />
                                            <Text style={styles.detailValue}>{selectedPatient.id}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Nome</Text>
                                        <Text style={styles.detailValue}>{selectedPatient.name}</Text>
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Sexo</Text>
                                        <Text style={styles.detailValue}>{selectedPatient.sex}</Text>
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Etnia</Text>
                                        <Text style={styles.detailValue}>{selectedPatient.ethnicity}</Text>
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Endereço</Text>
                                        <Text style={styles.detailValue}>{selectedPatient.address}</Text>
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Casos relacionados</Text>
                                        <Text style={styles.detailValue}>{selectedPatient.type}</Text>
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Solicitante da perícia</Text>
                                        <Text style={styles.detailValue}>{selectedPatient.applicant}</Text>
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Últimos Exames</Text>
                                        <Text style={styles.detailValue}>{selectedPatient.lastExam}</Text>
                                    </View>

                                    <View style={styles.modalActions}>
                                        <Text style={styles.actionsTitle}>Ações</Text>
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity style={styles.actionBtn}>
                                                <MaterialIcons name="edit" size={20} color="#4CAF50" />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.actionBtn}>
                                                <MaterialIcons name="close" size={20} color="#F44336" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.modalButtonsRow}>
                                        <TouchableOpacity style={styles.modalButton}>
                                            <MaterialIcons name="add" size={16} color="#4CAF50" />
                                            <Text style={styles.modalButtonText}>Adicionar evidência</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.modalButtonsRow}>
                                        <TouchableOpacity style={styles.modalButton}>
                                            <MaterialIcons name="folder-open" size={16} color="#4CAF50" />
                                            <Text style={styles.modalButtonText}>Gerar laudo</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.modalButton}>
                                            <MaterialIcons name="print" size={16} color="#4CAF50" />
                                            <Text style={styles.modalButtonText}>Solicitar Exame</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.modalButtonsRow}>
                                        <TouchableOpacity style={styles.modalButton}>
                                            <MaterialIcons name="visibility" size={16} color="#4CAF50" />
                                            <Text style={styles.modalButtonText}>Ver evidências</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity style={styles.saveModalButton}>
                                        <Text style={styles.saveModalButtonText}>Salvar</Text>
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
                                        setEditingPatient(null);
                                        setFormData({
                                            id: '',
                                            name: '',
                                            sex: '',
                                            ethnicity: '',
                                            address: '',
                                            type: '',
                                            applicant: '',
                                            lastExam: '',
                                            responsible: '',
                                            birthDate: '',
                                            examType: ''
                                        });
                                    }}
                                >
                                    <MaterialIcons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            {editingPatient && (
                                <ScrollView style={styles.viewModalBody}>
                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Código</Text>
                                        <View style={styles.detailValueContainer}>
                                            <MaterialIcons name="check-box" size={16} color="#4CAF50" />
                                            <TextInput
                                                value={formData.id}
                                                onChangeText={(text) => setFormData({ ...formData, id: text })}
                                                style={styles.editInput}
                                                mode="outlined"
                                                disabled
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Nome</Text>
                                        <TextInput
                                            value={formData.name}
                                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                                            style={styles.editInput}
                                            mode="outlined"
                                        />
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Sexo</Text>
                                        <TextInput
                                            value={formData.sex}
                                            onChangeText={(text) => setFormData({ ...formData, sex: text })}
                                            style={styles.editInput}
                                            mode="outlined"
                                        />
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Etnia</Text>
                                        <TextInput
                                            value={formData.ethnicity}
                                            onChangeText={(text) => setFormData({ ...formData, ethnicity: text })}
                                            style={styles.editInput}
                                            mode="outlined"
                                        />
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Endereço</Text>
                                        <TextInput
                                            value={formData.address}
                                            onChangeText={(text) => setFormData({ ...formData, address: text })}
                                            style={styles.editInput}
                                            mode="outlined"
                                        />
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Casos relacionados</Text>
                                        <TextInput
                                            value={formData.type}
                                            onChangeText={(text) => setFormData({ ...formData, type: text })}
                                            style={styles.editInput}
                                            mode="outlined"
                                        />
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Solicitante da perícia</Text>
                                        <TextInput
                                            value={formData.applicant}
                                            onChangeText={(text) => setFormData({ ...formData, applicant: text })}
                                            style={styles.editInput}
                                            mode="outlined"
                                        />
                                    </View>

                                    <View style={styles.patientDetailRow}>
                                        <Text style={styles.detailLabel}>Últimos Exames</Text>
                                        <TextInput
                                            value={formData.lastExam}
                                            onChangeText={(text) => setFormData({ ...formData, lastExam: text })}
                                            style={styles.editInput}
                                            mode="outlined"
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.saveModalButton}
                                        onPress={handleSavePatient}
                                    >
                                        <Text style={styles.saveModalButtonText}>Salvar</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            )}
                        </View>
                    </View>
                </Modal>

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

                <Modal
                    transparent={true}
                    visible={showEthnicityModal}
                    animationType="fade"
                    onRequestClose={() => setShowEthnicityModal(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setShowEthnicityModal(false)}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Selecionar Etnia</Text>
                            {ethnicityOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setFormData({ ...formData, ethnicity: option });
                                        setShowEthnicityModal(false);
                                    }}
                                >
                                    <Text style={styles.modalOptionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </PaperProvider>
    );
}

export default PatientScreen;