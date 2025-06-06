import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4f4',
  },
  header: {
    backgroundColor: '#f4f4f4f4f4',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  logoApp: {
    fontSize: 20,
    color: '#2d4a78',
    fontWeight: 'bold',
  },
  logoSpan: {
    color: '#31a248',
  },
  searchInput: {
    width: 320,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '10',
  },
  userText: {
    color: '#2d4a78',
    fontSize: 20,
    marginLeft: 5,
    marginRight: 10,
  },
  main: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: '20',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateInput: {
    width: 180,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#31a248',
    borderRadius: 5,
    width: 120,
    marginTop: 10,
    width: 370
  },
  content: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#31a248',
    marginRight: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
  },
  tableHeader: {
    minWidth: 100,
    justifyContent: 'center',
  },
  tableCell: {
    minWidth: 100,
    justifyContent: 'center',
  },
  examButton: {
    backgroundColor: '#31a248',
    borderRadius: 5,
  },
  status: {
    fontWeight: 'bold',
  },
  statusAberto: {
    color: '#31a248',
  },
  statusFechado: {
    color: '#dc3545',
  },
  statusDefault: {
    color: '#6c757d',
  },
  loading: {
    flex: 1,
    textAlign: 'center',
    fontSize: '25',
    marginTop: 20,
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
    borderRadius: 15,
    marginBottom: 40,
    marginTop: 5,
  },
});

export default styles;