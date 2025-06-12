import { apiRequest } from './apiService';

// Mapeamento de roles do backend para accessLevel da tela
const roleToAccessLevel = {
  ADMIN: 'Administrador',
  PERITO: 'Perito',
  ASSISTENTE: 'Assistente de Perito',
};

// Mapeamento inverso para envio ao backend
const accessLevelToRole = {
  'Administrador': 'ADMIN',
  'Perito': 'PERITO',
  'Assistente de Perito': 'ASSISTENTE',
};

// Função auxiliar para formatar dados do backend para a tela
const formatProfessional = (user) => ({
  id: user.id || '',
  name: user.name || 'Não informado',
  email: user.email || 'Não informado',
  password: '******', // Senha não é retornada pelo backend
  birthDate: user.birthDate || 'Não informado', // Campo não existe no backend
  sex: user.sex || 'Não informado', // Campo não existe no backend
  accessLevel: roleToAccessLevel[user.role] || 'Não especificado',
});

// Buscar todos os profissionais
export const fetchProfessionals = async () => {
  try {
    const data = await apiRequest('/users', 'GET', null, true);
    return Array.isArray(data) ? data.map(formatProfessional) : [];
  } catch (error) {
    console.error('Erro em fetchProfessionals:', error.message);
    throw new Error(error.message || 'Erro ao buscar profissionais');
  }
};

// Buscar profissional por ID
export const fetchProfessionalById = async (id) => {
  try {
    const data = await apiRequest(`/users/${id}`, 'GET', null, true);
    return formatProfessional(data);
  } catch (error) {
    console.error('Erro em fetchProfessionalById:', error.message);
    throw new Error(error.message || 'Erro ao buscar profissional');
  }
};

// Criar novo profissional
export const createProfessional = async (name, email, password, accessLevel) => {
  try {
    if (!name || name.trim() === '') {
      throw new Error('O nome é obrigatório.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Email inválido.');
    }
    if (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      throw new Error('A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.');
    }
    if (!accessLevel || !accessLevelToRole[accessLevel]) {
      throw new Error('Nível de acesso inválido. Escolha entre Administrador, Perito ou Assistente de Perito.');
    }

    const response = await apiRequest('/users', 'POST', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: accessLevelToRole[accessLevel],
    }, true);

    return formatProfessional(response);
  } catch (error) {
    console.error('Erro em createProfessional:', error.message);
    throw new Error(error.message || 'Erro ao criar profissional');
  }
};

// Atualizar profissional
export const updateProfessional = async (id, name, email, password, accessLevel) => {
  try {
    if (!name || name.trim() === '') {
      throw new Error('O nome é obrigatório.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Email inválido.');
    }
    if (password && password !== '******' && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      throw new Error('A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.');
    }
    if (!accessLevelToRole[accessLevel]) {
      throw new Error('Nível de acesso inválido. Escolha entre Administrador, Perito ou Assistente de Perito.');
    }

    const body = {};
    if (name) body.name = name.trim();
    if (email) body.email = email.trim().toLowerCase();
    if (password && password !== '******') body.password = password;
    if (accessLevel) body.role = accessLevelToRole[accessLevel];

    const response = await apiRequest(`/users/${id}`, 'PATCH', body, true);
    return formatProfessional(response);
  } catch (error) {
    console.error('Erro em updateProfessional:', error.message);
    throw new Error(error.message || 'Erro ao atualizar profissional');
  }
};

// Deletar profissional
export const deleteProfessional = async (id) => {
  try {
    const response = await apiRequest(`/users/${id}`, 'DELETE', null, true);
    return response;
  } catch (error) {
    console.error('Erro em deleteProfessional:', error.message);
    throw new Error(error.message || 'Erro ao deletar profissional');
  }
};