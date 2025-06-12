import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    elevation: 2,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  userText: {
    fontSize: 16,
    color: "#2d4a78",
    marginLeft: 5,
    marginRight: 10,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchInput: {
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: "#fff",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#6200ee",
    borderRadius: 4,
    paddingVertical: 5,
  },
  saveButtonText: {
    fontSize: 16,
  },
  sectionContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  professionalRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  professionalInfo: {
    flex: 4,
    flexDirection: "row",
  },
  professionalCode: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  professionalName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  professionalEmail: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  professionalAccessLevel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  professionalActions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
  },
  menuNav: {
    backgroundColor: "#fff",
    padding: 10,
    elevation: 2,
  },
  menuNavi: {
    flexDirection: "row",
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#aaaa",
    justifyContent: "center",
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  viewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  viewModalHeader: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeButton: {
    padding: 5,
  },
  viewModalBody: {
    padding: 20,
  },
  professionalDetailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
      borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  modalActions: {
    marginTop: 20,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    padding: 10,
  },
  saveModalButton: {
    backgroundColor: '#26a69a', 
    borderRadius: 4,
    padding: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  saveModalButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  editInput: {
    backgroundColor: '#fff',
  },
});
