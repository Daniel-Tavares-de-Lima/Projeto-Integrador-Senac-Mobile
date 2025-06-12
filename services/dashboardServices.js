import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCases } from './casosServices';
import { fetchVictims } from './vitimaServices';

// Buscar e processar dados para o dashboard
export async function fetchDashboardData() {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    const [cases, victims] = await Promise.all([fetchCases(), fetchVictims()]);

    return {
      cases: Array.isArray(cases) ? cases : [],
      victims: Array.isArray(victims) ? victims : [],
    };
  } catch (error) {
    console.error('Erro em fetchDashboardData:', error.message);
    throw error;
  }
}

// Filtrar casos por período
export function filterCasesByDate(cases, startDate, endDate) {
  if (!startDate || !endDate) return cases;

  const parseDate = (dateStr) => {
    const [month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1);
  };

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  return cases.filter((caseItem) => {
    if (!caseItem.dateFact) return false;
    const caseDate = new Date(caseItem.dateFact);
    const caseMonthYear = new Date(caseDate.getFullYear(), caseDate.getMonth());
    return caseMonthYear >= start && caseMonthYear <= end;
  });
}

// Processar dados para gráfico de tipos de caso
export function getCaseTypeData(cases) {
  const types = { ACIDENTE: 0, CRIMINAL: 0, IDENTIFICACAO: 0 };
  cases.forEach((caseItem) => {
    if (caseItem.classification in types) {
      types[caseItem.classification]++;
    }
  });

  return [
    { name: 'Acidente', value: types.ACIDENTE },
    { name: 'Criminal', value: types.CRIMINAL },
    { name: 'Identificação', value: types.IDENTIFICACAO },
  ].filter((item) => item.value > 0);
}

// Processar dados para gráfico de status
export function getStatusData(cases) {
  const statusCounts = { ANDAMENTO: 0, FINALIZADO: 0, ARQUIVADO: 0 };
  cases.forEach((caseItem) => {
    if (caseItem.statusCase in statusCounts) {
      statusCounts[caseItem.statusCase]++;
    }
  });

  return [
    { name: 'Em Andamento', value: statusCounts.ANDAMENTO, color: '#f59e0b' },
    { name: 'Finalizado', value: statusCounts.FINALIZADO, color: '#3b82f6' },
    { name: 'Arquivado', value: statusCounts.ARQUIVADO, color: '#ef4444' },
  ].filter((item) => item.value > 0);
}

// Processar dados para gráfico de sexo
export function getGenderData(victims) {
  const genderCounts = { Masculino: 0, Feminino: 0 };
  victims.forEach((victim) => {
    if (victim.sex === 'M') genderCounts.Masculino++;
    else if (victim.sex === 'F') genderCounts.Feminino++;
  });

  return [
    { name: 'Masculino', value: genderCounts.Masculino, color: '#3b82f6' },
    { name: 'Feminino', value: genderCounts.Feminino, color: '#ec4899' },
  ].filter((item) => item.value > 0);
}