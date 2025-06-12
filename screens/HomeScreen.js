import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, Appbar } from 'react-native-paper';
import styles from '../styles/stylesHome';
import { useNavigation } from '@react-navigation/native';
import { fetchCases } from '../services/casosServices';
import { fetchEvidences } from '../services/evidenciaServices';
import { fetchNotifications } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Home = () => {
  const [greeting, setGreeting] = useState('');
  const [doctorName, setDoctorName] = useState('Usuário');
  const [stats, setStats] = useState({ andamento: 0, finalizados: 0, arquivados: 0 });
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Bom dia');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }
    console.log('Saudação atualizada:', greeting);
  };

  const fetchData = async () => {
    console.log('Iniciando fetchData');
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        console.log('Token não encontrado. Redirecionando para login.');
        Alert.alert('Sessão expirada', 'Faça login novamente.', [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
        return;
      }

      const userInfo = await AsyncStorage.getItem('userInfo');
      let parsedUserInfo = {};
      try {
        if (userInfo) {
          parsedUserInfo = JSON.parse(userInfo);
          console.log('userInfo parseado:', parsedUserInfo);
        } else {
          console.log('Nenhum userInfo encontrado no AsyncStorage');
        }
      } catch (parseError) {
        console.error('Erro ao parsear userInfo:', parseError);
        await AsyncStorage.setItem('userInfo', JSON.stringify({}));
      }
      setDoctorName(parsedUserInfo?.name || 'Usuário');
      console.log('DoctorName definido:', parsedUserInfo?.name || 'Usuário');

      console.log('Iniciando chamadas de API: fetchCases, fetchEvidences, fetchNotifications');
      const [cases, evidences, notificationsData] = await Promise.all([
        fetchCases(token),
        fetchEvidences(token),
        fetchNotifications(token),
      ]);
      console.log('Dados recebidos - Casos:', cases);
      console.log('Dados recebidos - Evidências:', evidences);
      console.log('Dados recebidos - Notificações:', notificationsData);

      const statusCounter = {
        ANDAMENTO: 0,
        FINALIZADO: 0,
        ARQUIVADO: 0,
      };
      cases.forEach((item) => {
        if (item.statusCase && statusCounter[item.statusCase] !== undefined) {
          statusCounter[item.statusCase]++;
        }
      });
      console.log('Contagem de status:', statusCounter);
      setStats({
        andamento: statusCounter.ANDAMENTO,
        finalizados: statusCounter.FINALIZADO,
        arquivados: statusCounter.ARQUIVADO,
      });

      setNotifications(notificationsData.slice(0, 5));
      console.log('Notificações limitadas a 5:', notificationsData.slice(0, 5));

      const activities = [
        ...cases
          .filter(c => c.createdAt)
          .map(c => ({
            id: `case_${c.id}`,
            text: `Caso #${c.id} iniciado`,
            timestamp: c.createdAt,
            color: '#F97316',
          })),
        ...evidences
          .filter(e => e.dateCollection)
          .map(e => ({
            id: `evidence_${e.id}`,
            text: `Nova evidência ao caso #${e.caseId}`,
            timestamp: e.dateCollection,
            color: '#3B82F6',
          })),
      ]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 3);
      setRecentActivities(activities);
      console.log('Atividades recentes limitadas a 3:', activities);

      setError(null);
    } catch (err) {
      const errorMessage = err.message || 'Erro ao carregar dados';
      console.error('Erro em fetchData:', errorMessage, err);
      setError(errorMessage);
      if (errorMessage.includes('Usuário não autenticado')) {
        console.log('Erro de autenticação detectado. Redirecionando para login.');
        Alert.alert('Sessão expirada', 'Faça login novamente.', [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
      }
    }
  };

  useEffect(() => {
    updateGreeting();
    const greetingIntervalId = setInterval(updateGreeting, 60000);

    setIsLoading(true);
    fetchData().finally(() => setIsLoading(false));
    const dataIntervalId = setInterval(fetchData, 30000);

    return () => {
      clearInterval(greetingIntervalId);
      clearInterval(dataIntervalId);
      console.log('Intervalos de saudação e dados limpos');
    };
  }, [navigation]);

  const quickActions = [
    {
      title: 'Vítima',
      icon: 'user-plus',
      color: '#3B82F6',
      description: 'Adicionar vítimas',
      onPress: () => {
        console.log('Navegando para Victims');
        navigation.navigate('Victims');
      },
    },
    {
      title: 'Casos',
      icon: 'folder',
      color: '#10B981',
      description: 'Visualizar casos',
      onPress: () => {
        console.log('Navegando para Cases');
        navigation.navigate('Cases');
      },
    },
    {
      title: 'Evidências',
      icon: 'camera',
      color: '#8B5CF6',
      description: 'Capturar fotos',
      onPress: () => {
        console.log('Navegando para Evidencia');
        navigation.navigate('Evidencia');
      },
    },
    {
      title: 'Laudos',
      icon: 'file-text',
      color: '#F97316',
      description: 'Gerar relatórios',
      onPress: () => {
        console.log('Exibindo alerta: Laudos em desenvolvimento');
        Alert.alert('Info', 'Funcionalidade em desenvolvimento');
      },
    },
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000;
    let formattedTime;
    if (diff < 3600) {
      formattedTime = `Há ${Math.floor(diff / 60)} minutos`;
    } else if (diff < 86400) {
      formattedTime = `Há ${Math.floor(diff / 3600)} horas`;
    } else {
      formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    console.log('Timestamp formatado:', timestamp, '->', formattedTime);
    return formattedTime;
  };

  if (isLoading) {
    console.log('Renderizando estado de carregamento');
    return <Text style={styles.loading}>Carregando...</Text>;
  }

  console.log('Renderizando Home com dados:', { doctorName, stats, notifications, recentActivities });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{greeting}, {doctorName}!</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.controle}>
        <Appbar.Action
          color="#2d4a78"
          size={35}
          icon="menu"
          onPress={() => {
            console.log('Abrindo drawer');
            navigation.toggleDrawer();
          }}
          style={styles.menu}
        />
        <Appbar.Action
          icon="logout"
          color="#2d4a78"
          size={30}
          onPress={async () => {
            console.log('Iniciando logout');
            try {
              await AsyncStorage.removeItem('accessToken');
              await AsyncStorage.removeItem('userInfo');
              console.log('Token e userInfo removidos do AsyncStorage');
              navigation.replace('Login');
            } catch (logoutError) {
              console.error('Erro durante logout:', logoutError);
            }
          }}
        />
      </View>

      {error && (
        <Text style={styles.error}>
          {console.log('Exibindo erro:', error)}
          {error}
        </Text>
      )}

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
          <Card style={styles.statCard}>
            <Text style={styles.statText}>{stats.andamento} Casos em Andamento</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statText}>{stats.finalizados} Finalizados</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statText}>{stats.arquivados} Arquivados</Text>
          </Card>
        </View>
        {console.log('Resumo do Dia renderizado com stats:', stats)}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        {notifications.length === 0 ? (
          <Text style={styles.noData}>
            {console.log('Nenhuma notificação disponível')}
            Nenhuma notificação disponível
          </Text>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              style={[styles.notificationCard, { borderLeftColor: getPriorityColor(n.priority) }]}
            >
              <View style={styles.notificationContent}>
                <Text style={styles.notificationMessage}>{n.message}</Text>
                <Text style={styles.notificationTime}>{formatTimestamp(n.timestamp)}</Text>
                {console.log('Notificação renderizada:', n)}
              </View>
            </Card>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        <Card style={styles.recentCard}>
          {recentActivities.length === 0 ? (
            <Text style={styles.noData}>
              {console.log('Nenhuma atividade recente')}
              Nenhuma atividade recente
            </Text>
          ) : (
            recentActivities.map((activity) => (
              <View key={activity.id} style={styles.recentItem}>
                <View style={[styles.dot, { backgroundColor: activity.color }]} />
                <Text style={styles.recentText}>
                  {activity.text} - {formatTimestamp(activity.timestamp)}
                </Text>
                {console.log('Atividade recente renderizada:', activity)}
              </View>
            ))
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

export default Home;