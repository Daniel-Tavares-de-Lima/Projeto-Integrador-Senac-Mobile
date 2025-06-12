import AsyncStorage from '@react-native-async-storage/async-storage';

export async function login(email, password) {
  try {
    const response = await fetch('https://pi3p.onrender.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    await AsyncStorage.setItem('accessToken', data.accessToken); 
    await AsyncStorage.setItem('userInfo', JSON.stringify({ name: data.name || 'Usuário', role: data.role || 'USER', email: data.email || email }));

    return data;
  } catch (error) {
    console.error('Erro em login:', error.message);
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
}

export async function logout() {
  try {
    await AsyncStorage.removeItem('accessToken'); 
    await AsyncStorage.removeItem('userInfo');
  } catch (error) {
    console.error('Erro ao fazer logout:', error.message);
    throw new Error('Erro ao fazer logout');
  }
}

export async function getToken() {
  try {
    const token = await AsyncStorage.getItem('accessToken'); 
    return token;
  } catch (error) {
    console.error('Erro ao obter token:', error.message);
    return null;
  }
}

export async function getUserInfo() {
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Erro ao obter userInfo:', error.message);
    return null;
  }
}