
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

    // Armazena o token e informações do usuário no AsyncStorage
    await AsyncStorage.setItem('token', data.accessToken);
    await AsyncStorage.setItem('userInfo', JSON.stringify({ name: data.name || 'Usuário' }));

    return data;
  } catch (error) {
    console.error('Erro em login:', error.message);
    throw new Error(error.message || 'Erro ao conectar com o servidor');
  }
}
