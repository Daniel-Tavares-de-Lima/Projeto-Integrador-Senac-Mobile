import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4a78',
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchInput: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  formContainer: {
    backgroundColor: '#ff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    fontSize: 14,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    height: 48,
    paddingHorizontal: 12,
  },
  pickerText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  locationIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  addressInput: {
    backgroundColor: '#fff',
    paddingLeft: 40,
    flex: 1,
  },
  fileUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  fileUploadButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  fileUploadText: {
    fontSize: 14,
    color: '#333',
  },
  fileUploadLabel: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  addEvidenceButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 20,
    gap: 8,
  },
  addEvidenceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tableContainer: {
    minWidth: 800,
    backgroundColor: "#fff"
  },
  tableHeader: {
    backgroundColor: "#fff",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },

  tabelaConteudo:{
    backgroundColor: "#fff"
  },

  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 120,
    textAlign: 'center',
  },
  patientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  patientInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientCode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    width: 120,
    textAlign: 'center',
  },
  patientType: {
    fontSize: 14,
    color: '#333',
    width: 120,
    textAlign: 'center',
  },
  patientResponsible: {
    fontSize: 14,
    color: '#333',
    width: 120,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    width: 120,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  statusFinalizado: {
    backgroundColor: '#4CAF50',
  },
  statusAndamento: {
    backgroundColor: '#FFC107',
  },
  statusArquivado: {
    backgroundColor: '#2196F3',
  },
  statusDefault: {
    backgroundColor: '#9E9E9E',
  },
  patientActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 120,
    justifyContent: 'center',
  },
  actionButton: {
    padding: 4,
  },
  menuNav: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuNavi: {
    backgroundColor: '#fff',
    width: '280',
    height: '60',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 40,
    marginTop: 5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    minWidth: 250,
    maxHeight: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  viewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  viewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 8,
  },
  viewModalBody: {
    padding: 20,
  },
  patientDetailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalActions: {
    marginTop: 20,
    marginBottom: 20,
  },
  actionsTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flex: 1,
    marginHorizontal: 4,
    gap: 8,
  },
  modalButtonText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  saveModalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  saveModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  editInput: {
    flex: 1,
    backgroundColor: '#fff',
    fontSize: 14,
    borderRadius: 4,
    height: 40,
  }, 

  botaoArquivo: {
    marginVertical: 8,
  },
  botaoAdicionar: {
    marginTop: 8,
    backgroundColor: '#3ba44c',
  },
  botaoSalvar: {
    marginTop: 16,
    backgroundColor: '#26a69a',
  },
});

export default styles;