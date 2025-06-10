import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, Appbar } from 'react-native-paper';
import styles from '../styles/stylesHome';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [doctorName] = useState('Dr. Daniel');
  const navigation = useNavigation();

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Bom dia');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('Boa tarde');
      } else {
        setGreeting('Boa noite');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: 'Vítima',
      icon: 'user-plus',
      color: '#3B82F6',
      description: 'Adicionar vítimas',
      onPress: () => navigation.navigate('Victims'),
    },
    {
      title: 'Casos',
      icon: 'folder',
      color: '#10B981',
      description: 'Visualizar casos',
      onPress: () => navigation.navigate('Cases'),
    },
    {
      title: 'Evidências',
      icon: 'camera',
      color: '#8B5CF6',
      description: 'Capturar fotos',
      onPress: () => navigation.navigate('Evidencia'),
    },
    {
      title: 'Laudos',
      icon: 'file-text',
      color: '#F97316',
      description: 'Gerar relatórios',
      onPress: () => {}, // Você pode definir a ação aqui depois
    },
  ];

  const notifications = [
    { id: 1, type: 'pending', message: '3 laudos pendentes de revisão', priority: 'high' },
    { id: 2, type: 'alert', message: 'Caso #2024-001 aguarda documentação', priority: 'medium' },
    { id: 3, type: 'info', message: 'Backup automático realizado', priority: 'low' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#F87171';
      case 'medium':
        return '#FACC15';
      case 'low':
        return '#34D399';
      default:
        return '#D1D5DB';
    }
  };

  return (
    <ScrollView style={styles.container}>

      
      <View style={styles.header}>

        <View> 

          <Text style={styles.title}>{greeting}, {doctorName}!</Text>
        <Text style={styles.subtitle}>
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </Text>
        </View>
      </View>

      <View styles={styles.controle}>
        <Appbar.Action color="#2d4a78" size={35} icon="menu" onPress={() => navigation.toggleDrawer()} style={styles.menu}/>
        
        <Appbar.Action icon="logout" color="#2d4a78" onPress={async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userInfo');
            navigation.replace('Login');
          }}
        />

        {/* <Appbar.Action icon="logout" color="#2d4a78" size={30} onPress={async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userInfo');
            navigation.replace('Login')}}/> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickAction, { backgroundColor: action.color }]}
              onPress={action.onPress}
            >
              <Feather name={action.icon} size={24} color="white" />
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo do Dia</Text>
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}><Text style={styles.statText}>12 Casos Andamento</Text></Card>
          <Card style={styles.statCard}><Text style={styles.statText}>8 Finalizados</Text></Card>
          <Card style={styles.statCard}><Text style={styles.statText}>3 Pendentes</Text></Card>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        {notifications.map((n) => (
          <Card
            key={n.id}
            style={[styles.notificationCard, { borderLeftColor: getPriorityColor(n.priority) }]}
          >
            <View style={styles.notificationContent}>
              <Text style={styles.notificationMessage}>{n.message}</Text>
              <Text style={styles.notificationTime}>Há 2 horas</Text>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        <Card style={styles.recentCard}>
          <View style={styles.recentItem}>
            <View style={[styles.dot, { backgroundColor: '#34D399' }]} />
            <Text style={styles.recentText}>Laudo #2024-015 finalizado - 14:30</Text>
          </View>
          <View style={styles.recentItem}>
            <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.recentText}>Nova evidência ao caso #2024-014 - 13:45</Text>
          </View>
          <View style={styles.recentItem}>
            <View style={[styles.dot, { backgroundColor: '#F97316' }]} />
            <Text style={styles.recentText}>Caso #2024-013 iniciado - 12:20</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

export default Home;
