

import { apiRequest } from './apiService';

export const fetchCases = async () => {
  try {
    const data = await apiRequest('/cases', 'GET', null, true);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro em fetchCases:', error.message);
    throw new Error(error.message || 'Erro ao buscar casos');
  }
};

export const createCase = async (title, description, classification, managerId, solicitante, dateFact, statusCase, vitimas) => {
  try {
    if (!vitimas || !Array.isArray(vitimas) || vitimas.length === 0) {
      throw new Error('Pelo menos uma vítima deve ser associada ao caso.');
    }

    if (statusCase && !['ANDAMENTO', 'FINALIZADO', 'ARQUIVADO'].includes(statusCase)) {
      throw new Error('O status do caso deve ser ANDAMENTO, FINALIZADO ou ARQUIVADO.');
    }

    const response = await apiRequest('/cases', 'POST', {
      title,
      description,
      classification,
      managerId,
      solicitante: solicitante || undefined,
      dateFact,
      statusCase: statusCase || undefined,
      status: 'ATIVADO',
      vitimas,
    }, true);

    return response;
  } catch (error) {
    console.error('Erro em createCase:', error.message);
    throw new Error(error.message || 'Erro ao criar caso');
  }
};

export const updateCase = async (id, title, description, classification, managerId, solicitante, dateFact, statusCase, vitimas) => {
  try {
    if (!vitimas || !Array.isArray(vitimas) || vitimas.length === 0) {
      throw new Error('Pelo menos uma vítima deve ser associada ao caso.');
    }

    if (statusCase && !['ANDAMENTO', 'FINALIZADO', 'ARQUIVADO'].includes(statusCase)) {
      throw new Error('O status do caso deve ser ANDAMENTO, FINALIZADO ou ARQUIVADO.');
    }

    const body = {};
    if (title) body.title = title;
    if (description) body.description = description;
    if (classification) body.classification = classification;
    if (managerId) body.managerId = managerId;
    if (solicitante) body.solicitante = solicitante;
    if (dateFact) body.dateFact = dateFact;
    if (statusCase) body.statusCase = statusCase;
    if (vitimas) body.vitimas = vitimas;

    const response = await apiRequest(`/cases/${id}`, 'PATCH', body, true);
    return response;
  } catch (error) {
    console.error('Erro em updateCase:', error.message);
    throw new Error(error.message || 'Erro ao atualizar caso');
  }
};

export const deleteCase = async (id) => {
  try {
    const response = await apiRequest(`/cases/${id}`, 'DELETE', null, true);
    return response;
  } catch (error) {
    console.error('Erro em deleteCase:', error.message);
    throw new Error(error.message || 'Erro ao desativar caso');
  }
};