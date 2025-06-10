
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#f5f5f5',
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    userText: {
        fontSize: 18,
        color: '#2d4a78',
        marginLeft: 5,
        marginRight: 10,
    },
    main: {
        flex: 1,
        padding: 10,
    },
    searchInput: {
        marginBottom: 10,
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 2,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2d4a78',
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    textInput: {
        backgroundColor: '#fff',
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
        minHeight: 56,
        paddingHorizontal: 12,
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        width: '80%',
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#2d4a78',
    },
    modalOption: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
        minHeight: 56,
        justifyContent: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    fileUploadContainer: {
        marginBottom: 15,
    },
    fileUploadButton: {
        marginTop: 10,
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        borderRadius: 4,
    },
    fileUploadLabel: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 5,
    },
    saveButton: {
        marginTop: 10,
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        borderRadius: 4,
    },
    menuNav: {
        height: 70,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    menuNavi: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
    },
});

export default styles;