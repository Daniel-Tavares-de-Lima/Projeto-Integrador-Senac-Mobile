
import { fetchCases } from './casosServices';
import { fetchEvidences } from './evidenciaServices';

export const fetchNotifications = async () => {
  try {
    const [cases, evidences] = await Promise.all([fetchCases(), fetchEvidences()]);
    
    const notifications = [];

    // Notificações baseadas em casos
    cases.forEach((caseItem) => {
      if (caseItem.statusCase === 'ARQUIVADO' || !caseItem.vitimas?.length) {
        notifications.push({
          id: `case_${caseItem.id}`,
          type: 'alert',
          message: `Caso #${caseItem.id} aguarda documentação`,
          priority: 'medium',
          timestamp: new Date(caseItem.createdAt || Date.now()).toISOString(),
        });
      }
      if (caseItem.statusCase === 'ARQUIVADO') {
        notifications.push({
          id: `case_archived_${caseItem.id}`,
          type: 'pending',
          message: `Caso #${caseItem.id} arquivado`,
          priority: 'high',
          timestamp: new Date(caseItem.createdAt || Date.now()).toISOString(),
        });
      }
    });

    // Notificações baseadas em evidências
    evidences.forEach((evidence) => {
      if (evidence.status === 'pending') {
        notifications.push({
          id: `evidence_${evidence.id}`,
          type: 'info',
          message: `Evidência #${evidence.id} no caso #${evidence.caseId} pendente`,
          priority: 'low',
          timestamp: new Date(evidence.dateCollection || Date.now()).toISOString(),
        });
      }
    });

    // Ordenar por timestamp (mais recente primeiro)
    return notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Erro em fetchNotifications:', error.message);
    throw new Error(error.message || 'Erro ao buscar notificações');
  }
};



