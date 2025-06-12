




// import AsyncStorage from '@react-native-async-storage/async-storage';


// const GEMINI_API_KEY = "AIzaSyBwX_CAXvq9_sF-RlZEn_2k7lEpGN8BAkY";

// export const generateEvidenceReport = async (evidence, caseInfo) => {
//   try {
//     const token = await AsyncStorage.getItem('accessToken');
//     if (!token) {
//       throw new Error('Usuário não autenticado.');
//     }

//     const parseContent = (content) => {
//       try {
//         return JSON.parse(content || '{}');
//       } catch {
//         return {};
//       }
//     };

//     const contentData = parseContent(evidence.content);

//     const prompt = `
//       Você é um perito forense especializado. Gere um laudo pericial detalhado em português com base nas informações fornecidas. Estruture o laudo com as seções: **Introdução**, **Descrição da Evidência**, **Metodologia**, **Análise**, **Conclusões** e **Assinatura**. Use linguagem técnica e profissional.

//       **Informações da Evidência**:
//       - ID: ${evidence.id}
//       - Nome: ${contentData.nome || 'Não informado'}
//       - Tipo: ${evidence.type || 'Não informado'}
//       - Data de Coleta: ${new Date(evidence.dateCollection).toLocaleDateString('pt-BR')}
//       - Tipo de Exame: ${contentData.tipoExames || 'Não informado'}
//       - Caso ID: ${evidence.caseId || 'Não informado'}
//       - Localização: ${contentData.latitude && contentData.longitude 
//         ? `Latitude ${contentData.latitude}, Longitude ${contentData.longitude}` 
//         : 'Não informada'}
//       - Imagem: ${evidence.imageURL ? 'Imagem disponível' : 'Sem imagem'}

//       **Informações do Caso**:
//       - Título: ${caseInfo.title || 'Não informado'}
//       - Descrição: ${caseInfo.description || 'Não informado'}

//       Formate o laudo em Markdown com quebras de linha para legibilidade.
//     `;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: prompt }],
//             },
//           ],
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error?.message || 'Erro ao chamar a API do Gemini');
//     }

//     const result = await response.json();
//     const generatedText = result.candidates[0].content.parts[0].text;

//     await saveEvidenceReport(token, evidence.id, generatedText);

//     return { report: generatedText };
//   } catch (error) {
//     console.error('Erro ao gerar laudo:', error);
//     throw error;
//   }
// };

// export const saveEvidenceReport = async (token, evidenceId, reportContent) => {
//   try {
//     const response = await fetch('https://pi3p.onrender.com/reports', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         evidenceId,
//         content: reportContent,
//         title: `Laudo de Evidência ${evidenceId}`,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Erro ao salvar laudo');
//     }
//   } catch (error) {
//     console.error('Erro ao salvar laudo:', error);
//     throw error;
//   }
// };


import AsyncStorage from '@react-native-async-storage/async-storage';

const GEM_KEY = 'SUA_API_KEY'; // Substitua pela sua chave

export async function generateEvidenceReport(evidence, caseInfo) {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Usuário não autenticado.');

    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(evidence?.caseId);
    if (!isValidUUID) throw new Error('caseId inválido para a evidência.');

    const contentData = parseContent(evidence.content);

    const prompt = `
      Você é um perito forense especializado. Gere um laudo pericial detalhado em português para a evidência fornecida, semelhante a um relatório de caso. Estruture o laudo em Markdown com as seções: **Introdução**, **Descrição da Evidência**, **Metodologia**, **Análise**, **Conclusões** e **Assinatura**. Use linguagem técnica, objetiva e profissional.

      **Informações da Evidência**:
      - ID: ${evidence.id || 'Não informado'}
      - Nome: ${contentData.nome || 'Não informado'}
      - Tipo: ${evidence.type || 'Não informado'}
      - Data de Coleta: ${evidence.dateCollection ? new Date(evidence.dateCollection).toLocaleDateString('pt-BR') : 'Não informado'}
      - Tipo de Exame: ${contentData.tipoExames || 'Não informado'}
      - Caso ID: ${evidence.caseId || 'Não informado'}
      - Localização: ${contentData.latitude && contentData.longitude ? 
        `Latitude ${contentData.latitude}, Longitude ${contentData.longitude}` : 'Não informada'}
      - Descrição Visual: ${contentData.descriptionVisual || 'Não informado'}

      **Informações do Caso**:
      - Título: ${caseInfo.title || 'Não informado'}
      - Descrição: ${caseInfo.description || 'Não informado'}

      **Instruções**:
      - Na **Introdução**, contextualize o objetivo do laudo.
      - Na **Descrição da Evidência**, detalhe as características, incluindo descrição visual.
      - Na **Metodologia**, explique os procedimentos forenses (ex.: exame odontolegal).
      - Na **Análise**, interprete os dados.
      - Na **Conclusões**, resuma os achados.
      - Na **Assinatura**, inclua "Perito Responsável".
      - Formate em Markdown.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEM_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }], body }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro ao chamar a API do Gemini');
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    await saveEvidenceReport(token, evidence.id, evidence.caseId, generatedText);

    return { report: generatedText };
  } catch (error) {
    console.error('Erro ao gerar laudo:', error);
    throw error;
  }
}

export async function saveEvidenceReport(token, evidenceId, caseId, reportContent) {
  try {
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(caseId);
    if (!isValidUUID) throw new Error('caseId inválido para o relatório.');

    const response = await fetch('https://pi3p.onrender.com/reports', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        evidenceId,
        caseId, // Explicito
        title: `Laudo de Evidência ${evidenceId}`,
        content: reportContent,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erro ao salvar laudo');
    return data;
  } catch (error) {
    console.error('Erro ao salvar laudo:', error);
    throw error;
  }
}

function parseContent(content) {
  try {
    return JSON.parse(content || '{}');
  } catch {
    return {};
  }
}
