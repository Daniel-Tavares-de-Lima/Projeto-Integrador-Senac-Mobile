// import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://your-server-url:3000'; 

// /**
//  * Gera um laudo baseado em uma evidência específica
//  * @param {Object} evidence - Objeto da evidência
//  * @param {Object} caseInfo - Informações do caso
//  * @returns {Promise<Object>} - Laudo gerado
//  */
// export const generateEvidenceReport = async (evidence, caseInfo) => {
//   try {
//     const token = await AsyncStorage.getItem('token');
    
//     // Prepara os dados da evidência no formato esperado pelo servidor
//     const evidenceData = {
//       evidence_id: evidence.id,
//       case_id: evidence.caseId,
//       evidence_type: evidence.type,
//       date_collection: evidence.dateCollection,
//       location: evidence.location,
//       content: evidence.content,
//       case_info: caseInfo
//     };

//     const response = await fetch(`${API_BASE_URL}/generate-evidence-report`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(evidenceData),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error('Erro ao gerar laudo da evidência:', error);
//     throw new Error(error.message || 'Erro ao gerar laudo da evidência');
//   }
// };

// /**
//  * Busca laudos gerados para uma evidência específica
//  * @param {string} evidenceId - ID da evidência
//  * @returns {Promise<Array>} - Lista de laudos
//  */
// export const getEvidenceReports = async (evidenceId) => {
//   try {
//     const token = await AsyncStorage.getItem('token');
    
//     const response = await fetch(`${API_BASE_URL}/evidence-reports/${evidenceId}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error('Erro ao buscar laudos da evidência:', error);
//     throw new Error(error.message || 'Erro ao buscar laudos da evidência');
//   }
// };

// /**
//  * Salva um laudo gerado no servidor
//  * @param {string} evidenceId - ID da evidência
//  * @param {string} report - Conteúdo do laudo
//  * @returns {Promise<Object>} - Resultado da operação
//  */
// export const saveEvidenceReport = async (evidenceId, report) => {
//   try {
//     const token = await AsyncStorage.getItem('token');
    
//     const response = await fetch(`${API_BASE_URL}/save-evidence-report`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         evidence_id: evidenceId,
//         report: report,
//         generated_at: new Date().toISOString()
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error('Erro ao salvar laudo:', error);
//     throw new Error(error.message || 'Erro ao salvar laudo');
//   }
// };




import AsyncStorage from '@react-native-async-storage/async-storage';


const GEMINI_API_KEY = "AIzaSyBwX_CAXvq9_sF-RlZEn_2k7lEpGN8BAkY";

export const generateEvidenceReport = async (evidence, caseInfo) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Usuário não autenticado.');
    }

    const parseContent = (content) => {
      try {
        return JSON.parse(content || '{}');
      } catch {
        return {};
      }
    };

    const contentData = parseContent(evidence.content);

    const prompt = `
      Você é um perito forense especializado. Gere um laudo pericial detalhado em português com base nas informações fornecidas. Estruture o laudo com as seções: **Introdução**, **Descrição da Evidência**, **Metodologia**, **Análise**, **Conclusões** e **Assinatura**. Use linguagem técnica e profissional.

      **Informações da Evidência**:
      - ID: ${evidence.id}
      - Nome: ${contentData.nome || 'Não informado'}
      - Tipo: ${evidence.type || 'Não informado'}
      - Data de Coleta: ${new Date(evidence.dateCollection).toLocaleDateString('pt-BR')}
      - Tipo de Exame: ${contentData.tipoExames || 'Não informado'}
      - Caso ID: ${evidence.caseId || 'Não informado'}
      - Localização: ${contentData.latitude && contentData.longitude 
        ? `Latitude ${contentData.latitude}, Longitude ${contentData.longitude}` 
        : 'Não informada'}
      - Imagem: ${evidence.imageURL ? 'Imagem disponível' : 'Sem imagem'}

      **Informações do Caso**:
      - Título: ${caseInfo.title || 'Não informado'}
      - Descrição: ${caseInfo.description || 'Não informado'}

      Formate o laudo em Markdown com quebras de linha para legibilidade.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro ao chamar a API do Gemini');
    }

    const result = await response.json();
    const generatedText = result.candidates[0].content.parts[0].text;

    await saveEvidenceReport(token, evidence.id, generatedText);

    return { report: generatedText };
  } catch (error) {
    console.error('Erro ao gerar laudo:', error);
    throw error;
  }
};

export const saveEvidenceReport = async (token, evidenceId, reportContent) => {
  try {
    const response = await fetch('https://pi3p.onrender.com/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        evidenceId,
        content: reportContent,
        title: `Laudo de Evidência ${evidenceId}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao salvar laudo');
    }
  } catch (error) {
    console.error('Erro ao salvar laudo:', error);
    throw error;
  }
};