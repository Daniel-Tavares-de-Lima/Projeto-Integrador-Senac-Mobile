import { apiRequest } from './apiService';

export const fetchCases = async () => {
  return await apiRequest('/cases', 'GET', null, true);
};

export const createCase = async (caseData) => {
  if (!caseData.victims || !Array.isArray(caseData.victims) || caseData.victims.length === 0) {
    throw new Error("Pelo menos uma vítima deve ser associada ao caso.");
  }
  return await apiRequest('/cases', 'POST', {
    ...caseData,
    status: 'ATIVADO',
  }, true);
};

export const updateCase = async (id, caseData) => {
  if (!caseData.victims || !Array.isArray(caseData.victims) || caseData.victims.length === 0) {
    throw new Error("Pelo menos uma vítima deve ser associada ao caso.");
  }
  return await apiRequest(`/cases/${id}`, 'PATCH', caseData, true);
};

export const deleteCase = async (id) => {
  return await apiRequest(`/cases/${id}`, 'DELETE', null, true);
};