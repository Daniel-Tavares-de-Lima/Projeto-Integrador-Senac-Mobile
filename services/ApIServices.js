
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://pi3p.onrender.com';

export async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Usuário não autenticado.');
    }
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao conectar.');
    }

    return data;
  } catch (error) {
    console.error(`Erro em apiRequest (${endpoint}):`, error.message);
    throw error;
  }
}

export const fetchPatients = async () => {
  return await apiRequest('/patients', 'GET', null, true);
};

export const fetchCases = async () => {
  return await apiRequest('/cases', 'GET', null, true);
};
