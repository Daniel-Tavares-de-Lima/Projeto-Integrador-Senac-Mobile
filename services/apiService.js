import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'https://pi3p.onrender.com'; 

// export const apiRequest = async (url, method, data = null, auth = false, retries = 2) => {
//   let lastError;

//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const headers = {
//         'Content-Type': 'application/json',
//       };

//       if (auth) {
//         const token = await AsyncStorage.getItem('accessToken');
//         if (!token) {
//           throw new Error('Token de autenticação não encontrado.');
//         }
//         headers.Authorization = `Bearer ${token}`;
//       }

//       console.log(`Tentativa ${attempt}: ${method} ${API_URL}${url}`, {
//         data,
//         headers: { ...headers, Authorization: headers.Authorization ? 'Bearer [HIDDEN]' : undefined },
//       });

//       const response = await axios({
//         method,
//         url: `${API_URL}${url}`,
//         data,
//         headers,
//         timeout: 10000,
//       });

//       if (!response.data) {
//         console.warn(`Resposta vazia para ${url}`);
//         return null;
//       }

//       console.log(`Resposta recebida para ${url}:`, response.data);
//       return response.data;
//     } catch (error) {
//       lastError = error;
//       console.error(`Erro na tentativa ${attempt} (${url}):`, {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message,
//       });

//       if (error.code === 'ECONNABORTED' || !error.response) {
//         if (attempt < retries) {
//           console.log(`Tentando novamente em 2 segundos...`);
//           await new Promise(resolve => setTimeout(resolve, 2000));
//           continue;
//         }
//         throw new Error('Servidor indisponível ou sem conexão.');
//       }

//       if (error.response?.status === 401) {
//         throw new Error('Não autorizado. Verifique suas credenciais.');
//       }
//       if (error.response?.status === 500) {
//         throw new Error('Erro interno do servidor.');
//       }

//       throw new Error(error.response?.data?.message || 'Erro ao processar a requisição.');
//     }
//   }

//   throw lastError;
// };


// src/services/apiMobile.js


const API_URL = 'https://pi3p.onrender.com';

export async function apiRequest(endpoint, method = 'GET', body = null, requiresAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = await AsyncStorage.getItem('accessToken');
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

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao conectar.');
  }

  return data;
}


// export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
//   try {
//     const headers = {
//       'Content-Type': 'application/json',
//     };

//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     const config = {
//       method,
//       headers,
//       body: body ? JSON.stringify(body) : null,
//     };

//     console.log(`Iniciando requisição para ${endpoint} com método ${method}`);
//     const response = await fetch(`https://pi3p.onrender.com${endpoint}`, config);

//     const data = await response.json();

//     if (!response.ok) {
//       const errorMessage = data.message || 'Erro na requisição';
//       console.error(`Erro na requisição ${endpoint}:`, errorMessage);
//       throw new Error(errorMessage);
//     }

//     console.log(`Resposta recebida de ${endpoint}:`, data);
//     return data;
//   } catch (error) {
//     console.error(`Erro em apiRequest (${endpoint}):`, error.message);
//     throw new Error(error.message || 'Erro ao conectar com o servidor');
//   }
// };