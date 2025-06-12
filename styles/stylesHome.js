


import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Layout principal
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Cabeçalho
  header: {
    marginTop:40,
    padding: 20,
    // backgroundColor: '#eff6ff',
     backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row"
  },

   controle:{
    flexDirection: "row",
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Seções
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },

  // Ações rápidas
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  actionTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
  },
  actionDescription: {
    color: 'white',
    fontSize: 12,
  },

  // Cartões de estatísticas
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    margin: 4,
    padding: 16,
    alignItems: 'center',
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },

  // Notificações
  notificationCard: {
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  notificationContent: {
    padding: 12,
  },
  notificationMessage: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  // Itens recentes
  recentCard: {
    padding: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  recentText: {
    fontSize: 14,
    color: '#374151',
  },

  //-- Itens Variados
  sectionContainer:{
    margin: 20
  }
});

