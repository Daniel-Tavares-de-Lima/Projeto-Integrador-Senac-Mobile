import { StyleSheet } from 'react-native';

const stylesCases = StyleSheet.create({

  header:{
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 20
  },

  title:{
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20
  },
  
  CadastrarCasos: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    margin: 20,
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  menuInput: {
    backgroundColor: '#fff',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  botaoArquivo: {
    marginVertical: 12,
    borderColor: '#2d4a78',
  },
  botaoAdicionar: {
    marginVertical: 12,
    backgroundColor: '#3ba44c', 
  },
  botaoSalvar: {
    marginVertical: 12,
    backgroundColor: '#26a69a', 
  },
  botaoCancelar: {
    marginVertical: 12,
    borderColor: '#F44336', 
  },
  selectedVictimsContainer: {
    marginVertical: 12,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  selectedVictimsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d4a78',
    marginBottom: 8,
  },
  selectedVictim: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 8,
  },

  menuNav: {
  backgroundColor: '#fff',
  height: 90,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 5,
},

menuNavi: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  width: 220,
  height: 60,
  borderRadius: 30,
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 25,
},

addButtonWrapper: {
  width: 55,
  height: 55,
  borderRadius: 30,
  backgroundColor: '#3A5BA0',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: -20, // para dar o destaque elevado
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 4,
},
});

export default stylesCases;